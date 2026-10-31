import { useEffect, useState } from 'react';
import { Bot, Check, Search, X } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { CONTRACT } from '@/config/contract';
import { useLanguage } from '@/i18n/useLanguage';

const RPCS = [
  'https://bsc-dataseed-public.bnbchain.org',
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed.binance.org',
];

const SELECTORS = {
  totalMinted: '0xa2309ff8',
  mintOpen: '0x24bbd049',
  holdsAgentId: '0x11213086',
  mintedBy: '0x3cef28d2',
};

const SKILL_URL = 'https://agentcity.uk/agentcity-skill.md';

function padAddress(address: string) {
  return address.toLowerCase().replace('0x', '').padStart(64, '0');
}

async function ethCall(data: string): Promise<bigint> {
  for (const rpc of RPCS) {
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

type CheckResult = { holds: boolean; minted: number } | null;

export function MintPage() {
  const { t } = useLanguage();
  const [minted, setMinted] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean | null>(null);
  const [address, setAddress] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<CheckResult>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [total, isOpen] = await Promise.all([
          ethCall(SELECTORS.totalMinted),
          ethCall(SELECTORS.mintOpen),
        ]);
        if (!cancelled) {
          setMinted(Number(total));
          setOpen(isOpen === 1n);
        }
      } catch {
        // keep the last known values; the page retries on the next tick
      }
    };
    void load();
    const timer = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const progress = minted === null ? 0 : (minted / CONTRACT.totalSupply) * 100;

  const checkWallet = async () => {
    const addr = address.trim();
    setCheckResult(null);
    setCheckError(null);
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      setCheckError(t.mint.checkInvalid);
      return;
    }
    setChecking(true);
    try {
      const [holds, count] = await Promise.all([
        ethCall(SELECTORS.holdsAgentId + padAddress(addr)),
        ethCall(SELECTORS.mintedBy + padAddress(addr)),
      ]);
      setCheckResult({ holds: holds === 1n, minted: Number(count) });
    } catch {
      setCheckError(t.mint.checkInvalid);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 overflow-x-clip px-4 pt-24 pb-32 sm:gap-14 sm:px-5 sm:pt-28 lg:px-8 lg:pb-20 lg:pt-36">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader eyebrow={t.nav.mint} title={t.mint.title} subtitle={t.mint.subtitle} />
      </div>

      <ol className="mx-auto flex w-full max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:gap-4 md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:pb-0">
        {t.mint.steps.map((step, i) => (
          <li key={step.title} className="flex min-w-[82%] snap-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:min-w-[60%] sm:p-5 md:min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
              {i + 1}
            </span>
            <div>
              <h3 className="font-semibold text-white">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-5">
        <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:gap-6 sm:p-8 lg:col-span-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${open ? 'bg-emerald-400' : 'bg-amber-300'}`}
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-slate-200">
              {open === null ? t.mint.syncing : open ? t.mint.statusLive : t.mint.statusClosed}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">{t.mint.progress}</p>
            <p className="mt-2 font-display text-[26px] font-semibold text-white sm:text-3xl">
              {minted === null ? '—' : minted.toLocaleString('en-US')}
              <span className="text-lg text-slate-400">
                {' '}
                {t.mint.of} {CONTRACT.totalSupply.toLocaleString('en-US')}
              </span>
            </p>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={minted ?? 0}
            aria-valuemin={0}
            aria-valuemax={CONTRACT.totalSupply}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                <Bot className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-white">{t.mint.agentTitle}</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{t.mint.agentBody}</p>
            <pre className="whitespace-pre-wrap break-all rounded-xl bg-black/40 px-4 py-3 font-mono text-[13px] text-amber-200 sm:text-sm">
              {SKILL_URL}
            </pre>
          </div>

          <p className="text-sm text-slate-300">{t.mint.limit}</p>
          <p className="text-sm leading-relaxed text-slate-400">{t.mint.freeNote}</p>
        </section>

        <aside className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-8 lg:col-span-2">
          <h3 className="font-semibold text-white">{t.mint.checkTitle}</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.mint.checkPlaceholder}
              spellCheck={false}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder:text-slate-500 focus:border-amber-300/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={checkWallet}
              disabled={checking}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {checking ? t.mint.checking : t.mint.checkButton}
            </button>
          </div>
          {checkError && <p className="text-sm text-rose-300">{checkError}</p>}
          {checkResult && (
            <div className="flex flex-col gap-3">
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                  checkResult.holds ? 'bg-emerald-400/10 text-emerald-200' : 'bg-white/5 text-slate-200'
                }`}
              >
                {checkResult.holds ? (
                  <Check className="h-4 w-4 shrink-0" />
                ) : (
                  <X className="h-4 w-4 shrink-0" />
                )}
                {checkResult.holds ? t.mint.eligibleYes : t.mint.eligibleNo}
              </div>
              <p className="text-sm text-slate-300">
                {t.mint.checkMinted}:{' '}
                <span className="font-mono font-semibold text-white">
                  {checkResult.minted} / {CONTRACT.maxPerWallet}
                </span>
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2.5 px-4 pt-3 sm:px-5">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${open ? 'bg-emerald-400' : 'bg-amber-300'}`}
            aria-hidden="true"
          />
          <p className="truncate text-sm font-medium text-slate-100">
            {open === null ? t.mint.syncing : open ? t.mint.statusLive : t.mint.statusClosed}
          </p>
          <p className="ml-auto shrink-0 font-mono text-sm text-slate-300">
            {minted === null ? '—' : minted.toLocaleString('en-US')}
            <span className="text-slate-500"> / {CONTRACT.totalSupply.toLocaleString('en-US')}</span>
          </p>
        </div>
        <div className="mx-auto mt-2.5 w-full max-w-6xl px-4 pb-3 sm:px-5">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
