import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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


const SEARCH_TERMS = [
  '../%2F%2Freview.invalid', '../%2F%5Creview.invalid',
  '../%252F%252Freview.invalid', '..\\review.invalid', '//review.invalid',
  '%2e%2e/%2freview.invalid', '%252e%252e%252freview.invalid',
  '비트 코인', '한글 / 공백 & q=other?#%', '%2F', '%252F', 'a/b',
];

test.each(SEARCH_TERMS)('search keeps %s in one segment and preserves its API query', async (term) => {
  const expectedURL = `${API}/search/?c=currencies&q=${encodeURIComponent(term)}`;
  (global.fetch as jest.Mock).mockImplementation((url: RequestInfo) => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(String(url) === expectedURL ? { currencies: [COINS[0]] } : {}),
  } as Response));
  renderApp('/search');
  const input = await screen.findByPlaceholderText('Search coins...');
  fireEvent.change(input, { target: { value: term } });
  fireEvent.submit(input.closest('form') as HTMLFormElement);
  expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
  expect(window.location.pathname).toBe(`/search/${encodeURIComponent(term)}`);
  expect(global.fetch).toHaveBeenCalledWith(expectedURL);
  for (const link of Array.from(document.querySelectorAll('a'))) {
    expect(link.origin).toBe(window.location.origin);
  }
});

test.each(['.', '..'])('dot-only search %s stays on the search form', async (term) => {
  renderApp('/search');
  const input = await screen.findByPlaceholderText('Search coins...');
  fireEvent.change(input, { target: { value: term } });
  fireEvent.submit(input.closest('form') as HTMLFormElement);
  expect(await screen.findByRole('alert')).toHaveTextContent('Enter a search term other than . or ..');
  expect(window.location.pathname).toBe('/search');
  expect(global.fetch).not.toHaveBeenCalled();
});

const INVALID_IDS = [
  '//review.invalid', '/\\review.invalid', '\\review.invalid',
  '%2F%2Freview.invalid', '%252F%255Creview.invalid',
  '.', '..', '../btc-bitcoin', 'btc-bitcoin?x=y', 'https://review.invalid',
];

test.each(INVALID_IDS)('direct URL with invalid coin ID %s has no tabs or API requests', async (id) => {
  const segment = id === '.' || id === '..' ? id.replace(/\./g, '%252E') : encodeURIComponent(id);
  renderApp(`/${segment}/price`);
  expect(await screen.findByText('Invalid coin ID')).toBeInTheDocument();
  expect(screen.queryByText('Show Price')).not.toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
  for (const link of Array.from(document.querySelectorAll('a'))) {
    expect(link.origin).toBe(window.location.origin);
  }
});

test.each(['home', 'search'])('untrusted API IDs are excluded from %s links', async (page) => {
  const badCoins = INVALID_IDS.map((id, i) => ({ ...COINS[0], id, name: `Invalid ${i}` }));
  (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(page === 'home' ? [...COINS, ...badCoins] : { currencies: [...COINS, ...badCoins] }),
  } as Response));
  renderApp(page === 'home' ? '/' : '/search/bit');
  expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText('Invalid 0')).not.toBeInTheDocument());
  for (const link of Array.from(document.querySelectorAll('a'))) {
    expect(link.origin).toBe(window.location.origin);
    expect(link.pathname).not.toMatch(/review\.invalid|Invalid|%25|%2F|%5C/);
  }
});

test('relative tabs retain the coin when switching from a nested price or chart route', async () => {
  renderApp('/btc-bitcoin/price');
  expect(await screen.findByText('Market Capitalization')).toBeInTheDocument();
  userEvent.click(screen.getByText('Show Chart'));
  expect(window.location.pathname).toBe('/btc-bitcoin/chart');
  expect(await screen.findByText('Chart data is now blocked by API Provider.')).toBeInTheDocument();
  userEvent.click(screen.getByText('Show Price'));
  expect(window.location.pathname).toBe('/btc-bitcoin/price');
});


test.each([
  ['%252F', '%2F'], ['%25252F', '%252F'], ['%2F', '/'],
])('direct search URL segment %s is decoded once', async (segment, term) => {
  (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
    ok: true, json: () => Promise.resolve({ currencies: [COINS[0]] }),
  } as Response));
  renderApp(`/search/${segment}`);
  expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(`${API}/search/?c=currencies&q=${encodeURIComponent(term)}`);
});

test.each(['/search/%', '/search/a/b'])('malformed search path %s keeps the form without issuing API requests', async (path) => {
  renderApp(path);
  expect(await screen.findByPlaceholderText('Search coins...')).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});
