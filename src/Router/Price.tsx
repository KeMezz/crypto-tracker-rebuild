import { motion, Variants } from "framer-motion";
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

const Container = styled(motion.ul)`
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
const PriceBox = styled(motion.li)`
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

const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const elementVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

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
    <Container variants={containerVariants} initial="initial" animate="animate">
      <PriceBox variants={elementVariants}>
        <p>Market Capitalization</p>
        <h2>{marketCap ? `$${marketCap}` : "N/A"}</h2>
      </PriceBox>
      <PriceBox variants={elementVariants}>
        <p>Max Supply</p>
        <h2>{maxSupply ? `$${maxSupply}` : "N/A"}</h2>
      </PriceBox>
      <PriceBox variants={elementVariants}>
        <p>Total Supply</p>
        <h2>{totalSupply ? `$${totalSupply}` : "N/A"}</h2>
      </PriceBox>
      <PriceBox variants={elementVariants}>
        <p>Changes in 1 hour</p>
        <h2>{percent1h ? `${percent1h}%` : "N/A"}</h2>
      </PriceBox>
      <PriceBox variants={elementVariants}>
        <p>Changes in 24 hours</p>
        <h2>{percent24h ? `${percent24h}%` : "N/A"}</h2>
      </PriceBox>
      <PriceBox variants={elementVariants}>
        <p>Changes in 7 Days</p>
        <h2>{percent7d ? `${percent7d}%` : "N/A"}</h2>
      </PriceBox>
      <PriceBox variants={elementVariants}>
        <p>{coinName} in BTC</p>
        <h2>{priceBTC ? `${Number(priceBTC).toFixed(3)} BTC` : "N/A"}</h2>
      </PriceBox>
    </Container>
  );
}

export default Price;
