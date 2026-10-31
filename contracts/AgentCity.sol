// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Agent City
/// @notice Each eligible Binance Agentic Wallet ID is one city. Each city is one agent.
/// @dev Skeleton: review, test, and audit before mainnet deployment.
contract AgentCity is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 11_111;
    uint256 public constant MAX_PER_WALLET = 10;

    uint256 public mintFee;
    bool public mintOpen;
    bool public revealed;
    uint256 public revealOffset;
    uint256 public totalMinted;

    string public unrevealedURI;
    string public baseTokenURI;

    mapping(address => bool) public eligible;
    mapping(address => uint256) public mintedBy;

    event MintOpenUpdated(bool open);
    event MintFeeUpdated(uint256 fee);
    event EligibilityUpdated(address indexed wallet, bool allowed);
    event Minted(address indexed wallet, uint256 fromId, uint256 quantity);
    event Revealed(uint256 offset);
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
        uint256 initialFee,
        string memory initialUnrevealedURI
    ) ERC721("Agent City", "AGCITY") Ownable(msg.sender) {
        mintFee = initialFee;
        unrevealedURI = initialUnrevealedURI;
    }

    /// @notice Eligible wallets mint up to 10 cities each, paying the fixed BNB fee per city.
    /// @dev Only direct wallet transactions are accepted, so contract-based bots cannot mint.
    function mint(uint256 quantity) external payable {
        if (!mintOpen) revert MintClosed();
        if (msg.sender != tx.origin) revert ContractCallsNotAllowed();
        if (!eligible[msg.sender]) revert NotEligible();
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

    function setEligible(address[] calldata wallets, bool allowed) external onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            eligible[wallets[i]] = allowed;
            emit EligibilityUpdated(wallets[i], allowed);
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

    function setBaseTokenURI(string calldata uri) external onlyOwner {
        baseTokenURI = uri;
    }

    /// @notice Owner can reveal early; otherwise reveal happens automatically at sellout.
    function revealManually() external onlyOwner {
        _reveal();
    }

    function _reveal() internal {
        if (revealed) revert AlreadyRevealed();
        revealed = true;
        // Pseudo-random offset. Fine for a collection reveal, not for high-value randomness.
        revealOffset = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, totalMinted))) % MAX_SUPPLY;
        emit Revealed(revealOffset);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        if (!revealed) return unrevealedURI;
        uint256 shuffled = ((tokenId - 1) + revealOffset) % MAX_SUPPLY + 1;
        return string.concat(baseTokenURI, _toString(shuffled), ".json");
    }

    function withdraw(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NothingToWithdraw();
        (bool ok, ) = to.call{value: balance}("");
        if (!ok) revert TransferFailed();
        emit Withdrawn(to, balance);
    }

    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
