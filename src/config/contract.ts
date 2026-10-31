export const CONTRACT = {
  chainId: 56,
  chainName: 'BNB Smart Chain',
  address: '0x078e399a3eDb2fF0996BBa8994261f91E71568a1' as string,
  totalSupply: 11111,
  maxPerWallet: 10,
  feePerCityBnb: '0.0003',
};

export const isContractDeployed = CONTRACT.address.length > 0;
