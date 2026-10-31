export const CONTRACT = {
  chainId: 56,
  chainName: 'BNB Smart Chain',
  address: '' as string,
  totalSupply: 11111,
  maxPerWallet: 10,
  feePerCityBnb: '0.0003',
};

export const isContractDeployed = CONTRACT.address.length > 0;
