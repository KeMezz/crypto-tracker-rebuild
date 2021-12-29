import styled from "styled-components";

interface iPrice {
  percent1h?: string;
  percent24h?: string;
  percent7d?: string;
  marketCap?: string;
  totalSupply?: string;
  maxSupply?: string;
  priceBTC?: string;
  coinName?: string;
}

const Container = styled.ul`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, auto));
  gap: 18px;
  @media (max-width: 420px) {
    gap: 12px;
    margin-top: 18px;
    grid-template-columns: repeat(auto-fit, minmax(200px, auto));
  }
`;
const PriceBox = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 130px;
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 20px;
  @media (max-width: 420px) {
    height: 100px;
  }
  p {
    font-size: 16px;
    padding-bottom: 20px;
    font-weight: 400;
    @media (max-width: 420px) {
      font-size: 12px;
    }
  }
  h2 {
    font-size: 40px;
    font-weight: 700;
    @media (max-width: 420px) {
      font-size: 26px;
    }
  }
`;

function Price({
  percent1h,
  percent24h,
  percent7d,
  marketCap,
  totalSupply,
  maxSupply,
  priceBTC,
  coinName,
}: iPrice) {
  return (
    <Container>
      <PriceBox>
        <p>Market Capitalization</p>
        <h2>{marketCap ? `$${marketCap}` : "N/A"}</h2>
      </PriceBox>
      <PriceBox>
        <p>Max Supply</p>
        <h2>{maxSupply ? `$${maxSupply}` : "N/A"}</h2>
      </PriceBox>
      <PriceBox>
        <p>Total Supply</p>
        <h2>{totalSupply ? `$${totalSupply}` : "N/A"}</h2>
      </PriceBox>
      <PriceBox>
        <p>Changes in 1 hour</p>
        <h2>{percent1h}%</h2>
      </PriceBox>
      <PriceBox>
        <p>Changes in 24 hours</p>
        <h2>{percent24h}%</h2>
      </PriceBox>
      <PriceBox>
        <p>Changes in 7 Days</p>
        <h2>{percent7d}%</h2>
      </PriceBox>
      <PriceBox>
        <p>{coinName} in BTC</p>
        <h2>{priceBTC ? `${Number(priceBTC).toFixed(3)} BTC` : "N/A"}</h2>
      </PriceBox>
    </Container>
  );
}

export default Price;
