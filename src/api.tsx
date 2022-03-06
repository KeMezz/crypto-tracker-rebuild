export function fetchAllCoins() {
  return fetch(`https://api.coinpaprika.com/v1/coins`).then((response) =>
    response.json()
  );
}

export function fetchCoinInfo(coinId?: string) {
  return fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`).then(
    (response) => response.json()
  );
}

export function fetchCoinTickers(coinId?: string) {
  return fetch(`https://api.coinpaprika.com/v1/ticker/${coinId}`).then(
    (response) => response.json()
  );
}

export function fetchOHLCV(coinId?: string) {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 60 * 60 * 24 * 7 * 4;
  return fetch(
    `https://api.coinpaprika.com/v1/coins/${coinId}/ohlcv/historical?start=${start}&end=${end}`
  ).then((response) => response.json());
}

export function fetchSearch(searchId: string) {
  return fetch(
    `https://api.coinpaprika.com/v1/search/?c=currencies&q=${searchId}`
  ).then((response) => response.json());
}
