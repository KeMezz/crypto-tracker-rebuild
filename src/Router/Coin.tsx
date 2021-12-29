import { motion, Variants } from "framer-motion";
import { useQuery } from "react-query";
import { Link, useParams, Routes, Route, useMatch } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Toolbar from "../Components/Toolbar";
import Chart from "./Chart";
import Price from "./Price";

interface iCoinInfo {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  contract: string;
  platform: string;
  description: string;
  open_source: boolean;
  source_code: string;
}
interface iCoinTickers {
  id: string;
  name: string;
  symbol: string;
  rank: string;
  price_usd: string;
  price_btc: string;
  volume_24h_usd: string;
  market_cap_usd: string;
  circulating_supply: string;
  total_supply: string;
  max_supply: string;
  percent_change_1h: string;
  percent_change_24h: string;
  percent_change_7d: string;
  last_updated: string;
}

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 50px 0;
  text-transform: uppercase;
  font-size: 40px;
  font-weight: 700;
  @media (max-width: 420px) {
    font-size: 30px;
  }
`;

const TopContainer = styled(motion.section)`
  display: grid;
  gap: 18px;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  @media (max-width: 1000px) {
    gap: 12px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;

const TopBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 130px;
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 20px;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.1));
  @media (max-width: 420px) {
    height: 100px;
  }
  &:first-child {
    @media (max-width: 1000px) {
      grid-column: 1 / -1;
    }
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

const Desc = styled(motion.div)`
  margin-top: 30px;
  padding: 30px 12px;
  line-height: 1.6;
  @media (max-width: 420px) {
    margin-top: 10px;
  }
  h2 {
    font-size: 40px;
    font-weight: 700;
    padding-bottom: 12px;
    @media (max-width: 420px) {
      font-size: 26px;
    }
  }
  p {
    font-size: 20px;
    @media (max-width: 420px) {
      font-size: 18px;
    }
  }
`;

const SelectorContainer = styled(motion.section)`
  margin-top: 36px;
  margin-bottom: 100px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  @media (max-width: 420px) {
    margin-top: 20px;
  }
`;
const Selector = styled(motion.div)<{ clicked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px 28px;
  text-align: center;
  background-color: ${(props) =>
    props.clicked ? props.theme.textColor : props.theme.cardColor};
  color: ${(props) =>
    props.clicked ? props.theme.cardColor : props.theme.textColor};
  font-size: 20px;
  border-radius: 16px;
  font-weight: 500;
  transition: background-color 0.2s ease-in;
  @media (min-width: 420px) {
    &:hover {
      background-color: ${(props) => props.theme.textColor};
      color: ${(props) => props.theme.cardColor};
    }
  }
  @media (max-width: 420px) {
    padding: 12px 20px;
    font-size: 16px;
    line-height: 1.4;
  }
`;

const RoutesContainer = styled.section`
  grid-column: 1/ -1;
`;

const topContainerVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const descVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.3,
    },
  },
};

const selectorVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6,
      duration: 0.3,
    },
  },
};

function Coin() {
  const { coinId } = useParams();
  const { isLoading: infoLoading, data: infoData } = useQuery<iCoinInfo>(
    [coinId, "info"],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<iCoinTickers>(
      [coinId, "tickers"],
      () => fetchCoinTickers(coinId),
      { refetchInterval: 1000 }
    );
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");

  const isLoading = infoLoading && tickersLoading;

  return isLoading ? (
    <Header>loading...</Header>
  ) : (
    <>
      <Header>{infoData?.name}</Header>
      <TopContainer
        variants={topContainerVariants}
        initial="initial"
        animate="animate"
      >
        <TopBox>
          <p>{infoData?.name} in USD</p>
          <h2>
            {tickersData?.price_usd
              ? `$${Number(tickersData?.price_usd).toFixed(2)}`
              : "Loading..."}
          </h2>
        </TopBox>
        <TopBox>
          <p>Rank</p>
          <h2>#{infoData?.rank}</h2>
        </TopBox>
        <TopBox>
          <p>Symbol</p>
          <h2>{infoData?.symbol}</h2>
        </TopBox>
        <TopBox>
          <p>Open Source</p>
          <h2>{infoData?.open_source ? "Yes" : "No"}</h2>
        </TopBox>
      </TopContainer>
      {infoData?.description ? (
        <Desc variants={descVariants} initial="initial" animate="animate">
          <h2>What is {infoData?.name}?</h2>
          <p>{infoData?.description}</p>
        </Desc>
      ) : null}
      <hr />
      <SelectorContainer
        variants={selectorVariants}
        initial="initial"
        animate="animate"
      >
        <Link to={`/${coinId}/price`}>
          <Selector clicked={priceMatch !== null ? true : false}>
            Show Price
          </Selector>
        </Link>
        <Link to={`/${coinId}/chart`}>
          <Selector clicked={chartMatch !== null ? true : false}>
            Show Chart
          </Selector>
        </Link>
        <RoutesContainer>
          <Routes>
            <Route
              path="/price"
              element={
                <Price
                  percent1h={tickersData?.percent_change_1h}
                  percent24h={tickersData?.percent_change_24h}
                  percent7d={tickersData?.percent_change_7d}
                  marketCap={tickersData?.market_cap_usd}
                  totalSupply={tickersData?.total_supply}
                  maxSupply={tickersData?.max_supply}
                  priceBTC={tickersData?.price_btc}
                  coinName={infoData?.name}
                />
              }
            ></Route>
            <Route path="/chart" element={<Chart coinId={coinId} />}></Route>
          </Routes>
        </RoutesContainer>
      </SelectorContainer>
    </>
  );
}

export default Coin;
