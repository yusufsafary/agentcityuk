// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Agent City (AGCITY) - agentcity.uk
/// @notice Setiap Binance Agentic Wallet ID yang masuk daftar eligible adalah satu kota.
///         Konsep mengikuti web agentcity.uk persis:
///         - Supply 11.111, maks 10 per wallet, mint(value) dengan quantity 1..10.
///         - Mint GRATIS (harga NFT 0) + fee tetap per kota dalam BNB sebagai filter bot.
///           Fee awal 0.0003 BNB per kota (sesuai src/config/contract.ts di repo web:
///           feePerCityBnb = '0.0003'), bisa diatur owner lewat setMintFee().
///         - Eligibility = gerbang Binance Agent ID (SPACE ID Agent ID NFT on-chain),
///           SAMA seperti proyek-proyek Agentic Pass sebelumnya (NOMIO/UAP/MPAL/PUP/
///           WEDO/ZAPLO): wallet wajib memegang Agent ID, dicek via holdsAgentId().
///         - Anti-bot: panggilan dari kontrak ditolak (msg.sender harus tx.origin).
///         - Reveal OTOMATIS saat sold out (totalMinted == MAX_SUPPLY): sebelum reveal
///           semua token menunjuk satu placeholder (unrevealedURI); sesudah reveal
///           tokenURI = baseTokenURI + id hasil shuffle offset + ".json".
///           Owner juga bisa reveal lebih awal lewat revealManually().
///         - withdraw() tanpa argumen ke owner (selector 0x3ccfd60b, pola operasional
///           yang sama seperti kontrak-kontrak Agentic Pass sebelumnya).
///         - Mint deploy TERTUTUP (mintOpen = false).
contract AgentCity is ERC721, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 11_111;
    uint256 public constant MAX_PER_WALLET = 10;

    /// @notice Kontrak NFT SPACE ID Agent ID di BSC ("SPACE ID Agent ID", simbol AI).
    IERC721 public constant AGENT_ID =
        IERC721(0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F);

    uint256 public mintFee; // wei per kota
    bool public mintOpen; // false saat deploy
    bool public revealed;
    uint256 public revealOffset;
    uint256 public totalMinted;

    string public unrevealedURI;
    string public baseTokenURI;

    mapping(address => uint256) public mintedBy;

    event MintOpenUpdated(bool open);
    event MintFeeUpdated(uint256 fee);
    event Minted(address indexed wallet, uint256 fromId, uint256 quantity);
    event Revealed(uint256 offset);
    event BaseURIChanged(string baseURI);
    event UnrevealedURIChanged(string uri);
    event Withdrawn(address indexed to, uint256 amount);

    error MintClosed();
    error NotEligible();
    error ContractCallsNotAllowed();
    error WrongFee();
    error ExceedsWalletLimit();
    error ExceedsMaxSupply();
    error ZeroQuantity();
    error AlreadyRevealed();
    error NothingToWithdraw();
    error TransferFailed();

    constructor(
        address initialOwner,
        uint256 initialFee,
        string memory initialUnrevealedURI,
        string memory initialBaseURI
    ) ERC721("Agent City", "AGCITY") Ownable(initialOwner) {
        mintFee = initialFee;
        unrevealedURI = initialUnrevealedURI;
        baseTokenURI = initialBaseURI;
        mintOpen = false;
    }

    /// @notice Harga yang harus dikirim per kota saat ini (= mintFee; harga NFT-nya 0).
    function currentPrice() external view returns (uint256) {
        return mintFee;
    }

    /// @notice True bila wallet memegang Binance Agent ID (gerbang eligibility).
    function holdsAgentId(address account) public view returns (bool) {
        return AGENT_ID.balanceOf(account) > 0;
    }

    /// @notice Wallet pemegang Agent ID mint 1..10 kota per panggilan, membayar fee tetap per kota.
    /// @dev Hanya transaksi langsung dari wallet; kontrak lain ditolak sebagai filter bot.
    function mint(uint256 quantity) external payable {
        // 1) Gerbang Agent ID — diperiksa sebelum apa pun (pola proyek sebelumnya).
        if (!holdsAgentId(msg.sender)) revert NotEligible();
        // 2) Hanya wallet langsung, panggilan dari kontrak lain ditolak.
        if (msg.sender != tx.origin) revert ContractCallsNotAllowed();
        if (!mintOpen) revert MintClosed();
        if (quantity == 0) revert ZeroQuantity();
        if (mintedBy[msg.sender] + quantity > MAX_PER_WALLET) revert ExceedsWalletLimit();
        if (totalMinted + quantity > MAX_SUPPLY) revert ExceedsMaxSupply();
        if (msg.value != mintFee * quantity) revert WrongFee();

        uint256 fromId = totalMinted + 1;
        mintedBy[msg.sender] += quantity;
        totalMinted += quantity;

        for (uint256 i = 0; i < quantity; i++) {
            _mint(msg.sender, fromId + i);
        }
        emit Minted(msg.sender, fromId, quantity);

        if (totalMinted == MAX_SUPPLY) {
            _reveal();
        }
    }

    function setMintOpen(bool open) external onlyOwner {
        mintOpen = open;
        emit MintOpenUpdated(open);
    }

    function setMintFee(uint256 fee) external onlyOwner {
        mintFee = fee;
        emit MintFeeUpdated(fee);
    }

    function setBaseURI(string calldata uri) external onlyOwner {
        baseTokenURI = uri;
        emit BaseURIChanged(uri);
    }

    function setUnrevealedURI(string calldata uri) external onlyOwner {
        unrevealedURI = uri;
        emit UnrevealedURIChanged(uri);
    }

    /// @notice Owner bisa reveal lebih awal; tanpa ini reveal terjadi otomatis saat sold out.
    function revealManually() external onlyOwner {
        _reveal();
    }

    function _reveal() internal {
        if (revealed) revert AlreadyRevealed();
        revealed = true;
        // Offset pseudo-random untuk shuffle peta. Cukup untuk reveal koleksi,
        // bukan untuk randomness bernilai tinggi.
        revealOffset = uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.timestamp,
                    blockhash(block.number - 1),
                    totalMinted
                )
            )
        ) % MAX_SUPPLY;
        emit Revealed(revealOffset);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        if (!revealed) return unrevealedURI;
        uint256 shuffled = ((tokenId - 1) + revealOffset) % MAX_SUPPLY + 1;
        return string.concat(baseTokenURI, shuffled.toString(), ".json");
    }

    /// @notice Tarik seluruh saldo BNB kontrak ke owner.
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NothingToWithdraw();
        (bool ok, ) = payable(owner()).call{value: balance}("");
        if (!ok) revert TransferFailed();
        emit Withdrawn(owner(), balance);
    }
}
