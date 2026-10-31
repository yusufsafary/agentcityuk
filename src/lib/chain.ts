import { CONTRACT } from '@/config/contract';

export const BSC_RPCS = [
  'https://bsc-dataseed-public.bnbchain.org',
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed.binance.org',
];

export const SELECTORS = {
  totalMinted: '0xa2309ff8',
  mintOpen: '0x24bbd049',
  holdsAgentId: '0x11213086',
  mintedBy: '0x3cef28d2',
};

export function padAddress(address: string) {
  return address.toLowerCase().replace('0x', '').padStart(64, '0');
}

export async function ethCall(data: string): Promise<bigint> {
  for (const rpc of BSC_RPCS) {
    try {
      const resp = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{ to: CONTRACT.address, data }, 'latest'],
        }),
      });
      const json = (await resp.json()) as { result?: string };
      if (json.result) return BigInt(json.result);
    } catch {
      // try the next RPC
    }
  }
  throw new Error('all RPC endpoints failed');
}

export async function readMintState(): Promise<{ minted: number; open: boolean }> {
  const [total, isOpen] = await Promise.all([
    ethCall(SELECTORS.totalMinted),
    ethCall(SELECTORS.mintOpen),
  ]);
  return { minted: Number(total), open: isOpen === 1n };
}
