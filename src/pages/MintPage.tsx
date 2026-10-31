import { useState } from 'react';
import { Check, Circle, Wallet } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { CONTRACT, isContractDeployed } from '@/config/contract';
import { useLanguage } from '@/i18n/useLanguage';

const MAX_QTY = CONTRACT.maxPerWallet;

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function MintPage() {
  const { t } = useLanguage();
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const hasWallet = typeof window !== 'undefined' && Boolean(window.ethereum);
  const minted = 0;
  const progress = (minted / CONTRACT.totalSupply) * 100;
  const totalFee = (Number(CONTRACT.feePerCityBnb) * quantity).toFixed(4);

  const connect = async () => {
    if (!window.ethereum) {
      setError(t.mint.noWallet);
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
      setAccount(accounts[0] ?? null);
    } catch {
      setError(t.mint.connectError);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setError(null);
  };

  const canMint = Boolean(account) && isContractDeployed;

  return (
    <div className="flex flex-col gap-14 px-5 pt-28 pb-20 lg:px-8 lg:pt-36">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader eyebrow={t.nav.mint} title={t.mint.title} subtitle={t.mint.subtitle} />
      </div>

      <ol className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-3">
        {t.mint.steps.map((step, i) => {
          const done = i === 0 && Boolean(account);
          return (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  done ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-white'
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-5">
        <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 lg:col-span-3">
          {!account ? (
            <div className="flex flex-col items-start gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
                <Wallet className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={connect}
                disabled={connecting}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {connecting ? '...' : t.mint.connect}
              </button>
              {!hasWallet && <p className="text-sm text-slate-400">{t.mint.noWallet}</p>}
              {error && <p className="text-sm text-rose-300">{error}</p>}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">{t.mint.addressLabel}</p>
                  <p className="mt-1 font-mono text-base text-white">{shortAddress(account)}</p>
                </div>
                <button
                  type="button"
                  onClick={disconnect}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
                >
                  {t.mint.disconnect}
                </button>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-200">
                <Circle className="h-3 w-3 fill-amber-300 text-amber-300" />
                {t.mint.eligibleUnknown}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-200">{t.mint.quantity}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.from({ length: MAX_QTY }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setQuantity(n)}
                      aria-pressed={quantity === n}
                      className={`h-11 w-11 rounded-xl text-sm font-semibold transition-all ${
                        quantity === n
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                          : 'bg-white/5 text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-white/10 p-4 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>{t.mint.perCity}</span>
                  <span className="font-mono">{CONTRACT.feePerCityBnb} BNB</span>
                </div>
                <div className="flex justify-between font-semibold text-white">
                  <span>{t.mint.total}</span>
                  <span className="font-mono">{totalFee} BNB</span>
                </div>
              </div>

              <button
                type="button"
                disabled={!canMint}
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-400"
              >
                {t.mint.mintButton}
              </button>
              {!isContractDeployed && <p className="text-sm leading-relaxed text-slate-400">{t.mint.notOpen}</p>}
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 lg:col-span-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">{t.mint.progress}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white">
              {minted.toLocaleString('en-US')}
              <span className="text-lg text-slate-400">
                {' '}
                {t.mint.of} {CONTRACT.totalSupply.toLocaleString('en-US')}
              </span>
            </p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={minted} aria-valuemin={0} aria-valuemax={CONTRACT.totalSupply}>
            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-slate-300">{t.mint.limit}</p>
          <p className="text-sm leading-relaxed text-slate-400">{t.mint.freeNote}</p>
        </aside>
      </div>
    </div>
  );
}
