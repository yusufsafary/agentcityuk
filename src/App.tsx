import { useHashRoute } from '@/hooks/useHashRoute';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { ConceptPage } from '@/pages/ConceptPage';
import { FaqPage } from '@/pages/FaqPage';
import { HomePage } from '@/pages/HomePage';
import { MarketPage } from '@/pages/MarketPage';
import { MintPage } from '@/pages/MintPage';
import { RoadmapPage } from '@/pages/RoadmapPage';

function Site() {
  const { route, navigate } = useHashRoute();

  let page;
  switch (route) {
    case '/concept':
      page = <ConceptPage />;
      break;
    case '/mint':
      page = <MintPage />;
      break;
    case '/roadmap':
      page = <RoadmapPage />;
      break;
    case '/faq':
      page = <FaqPage />;
      break;
    case '/market':
      page = <MarketPage navigate={navigate} />;
      break;
    default:
      page = <HomePage navigate={navigate} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <SiteHeader route={route} navigate={navigate} />
      <main className="flex-1">
        <div key={route} className="page-enter">
          {page}
        </div>
      </main>
      <SiteFooter navigate={navigate} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Site />
    </LanguageProvider>
  );
}

export default App;
