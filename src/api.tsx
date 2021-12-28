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
