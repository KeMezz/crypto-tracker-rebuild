import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import App from './App';

// Network is mocked: CoinPaprika responses are canned; router, react-query,
// recoil, framer-motion, react-hook-form and styled-components are real.
const COINS = [
  { id: 'btc-bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1, is_new: false, is_active: true, type: 'coin' },
  { id: 'eth-ethereum', name: 'Ethereum', symbol: 'ETH', rank: 2, is_new: false, is_active: true, type: 'coin' },
];
const INFO = { ...COINS[0], description: 'Digital gold', open_source: true };
const TICKER = {
  id: 'btc-bitcoin', price_usd: 65000.5, price_btc: 1, market_cap_usd: 1234567, total_supply: 19000000, max_supply: 21000000,
  percent_change_1h: 0.5, percent_change_24h: -1.2, percent_change_7d: 3.4,
};
const API = 'https://api.coinpaprika.com/v1';
const routes: Record<string, unknown> = {
  [`${API}/coins`]: COINS,
  [`${API}/coins/btc-bitcoin`]: INFO,
  [`${API}/ticker/btc-bitcoin`]: TICKER,
  [`${API}/search/?c=currencies&q=bit`]: { currencies: [COINS[0]] },
};

const renderApp = (path = '/') => {
  window.history.pushState({}, '', path);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

beforeEach(() => {
  // react-router >= 6.28 logs v7 future-flag notices; they are not part of what is tested here.
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
  global.fetch = jest.fn((url: RequestInfo) => {
    const body = routes[String(url)];
    return Promise.resolve({ ok: !!body, json: () => Promise.resolve(body) } as Response);
  }) as jest.Mock;
});

test('home lists coins from the API and links each one to its detail route', async () => {
  renderApp();
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
  expect(screen.getByText('Ethereum').closest('a')).toHaveAttribute('href', '/eth-ethereum');
  expect(screen.getByText('Bitcoin').closest('a')).toHaveAttribute('href', '/btc-bitcoin');
  expect(global.fetch).toHaveBeenCalledWith(`${API}/coins`);
});

test('opening a coin shows price, rank, description and the Show Price tab', async () => {
  renderApp();
  userEvent.click((await screen.findByText('Bitcoin')).closest('a') as HTMLElement);
  expect(await screen.findByText('Bitcoin in USD')).toBeInTheDocument();
  expect(screen.getByText('$65000.50')).toBeInTheDocument();
  expect(screen.getByText('#1')).toBeInTheDocument();
  expect(screen.getByText('Digital gold')).toBeInTheDocument();
  userEvent.click(screen.getByText('Show Price'));
  expect(window.location.pathname).toBe('/btc-bitcoin/price');
  expect(await screen.findByText('Market Capitalization')).toBeInTheDocument();
  expect(screen.getByText('$1234567')).toBeInTheDocument();
  expect(screen.getByText('-1.2%')).toBeInTheDocument();
});

test('toolbar search form navigates to /search/<term> and renders the matching coins', async () => {
  const { container } = renderApp();
  await screen.findByText('Bitcoin');
  userEvent.click(container.querySelector('a[href="/search"]') as HTMLElement);
  userEvent.type(await screen.findByPlaceholderText('Search coins...'), 'bit{enter}');
  expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
  expect(window.location.pathname).toBe('/search/bit');
  expect(global.fetch).toHaveBeenCalledWith(`${API}/search/?c=currencies&q=bit`);
  expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
});
