import { useEffect, useState } from 'react';

export type Route = '/' | '/concept' | '/mint' | '/roadmap' | '/faq' | '/market';

const ROUTES: Route[] = ['/', '/concept', '/mint', '/roadmap', '/faq', '/market'];

function parseRoute(): Route {
  const path = window.location.hash.replace(/^#/, '') || '/';
  return (ROUTES.includes(path as Route) ? path : '/') as Route;
}

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const onChange = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (next: Route) => {
    window.location.hash = next;
  };

  return { route, navigate };
}
