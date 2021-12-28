import { motion, useViewportScroll, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchAllCoins } from "../api";

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  text-transform: uppercase;
  font-size: 40px;
  font-weight: 300;
  b {
    font-weight: 700;
  }
  @media (max-width: 420px) {
    font-size: 30px;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
`;

const Lists = styled(motion.ul)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, auto));
  gap: 18px;
  margin-bottom: 60px;
  @media (max-width: 420px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, auto));
    gap: 12px;
  }
`;

const List = styled(motion.li)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 80px;
  background-color: ${(props) => props.theme.cardColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 20px;
  cursor: pointer;
  .left {
    display: flex;
    align-items: center;
    gap: 20px;
    img {
      width: 40px;
      @media (max-width: 420px) {
        width: 30px;
      }
    }
    h3 {
      font-size: 20px;
    }
  }
  @media (max-width: 420px) {
    height: 60px;
    padding: 0 14px;
  }
`;

interface iCoins {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const listsVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const listVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

function Home() {
  const { isLoading, data } = useQuery<iCoins[]>("allCoins", fetchAllCoins);
  const [coinCount, setCoinCount] = useState(100);
  const { scrollYProgress } = useViewportScroll();
  useEffect(
    () =>
      scrollYProgress.onChange(() =>
        scrollYProgress.get() > 0.99 ? setCoinCount((prev) => prev + 40) : null
      ),
    [scrollYProgress]
  );
  return (
    <>
      <Header>
        <span>crypto</span>
        <b>tracker</b>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Lists variants={listsVariants} initial="initial" animate="animate">
          {data?.slice(0, coinCount)?.map((item) => (
            <Link
              key={item.id}
              to={`/${item.id}`}
              state={{ name: item.name, id: item.id }}
            >
              <List
                variants={listVariants}
                whileHover={{ backgroundColor: "rgba(251, 197, 49,1.0)" }}
              >
                <div className="left">
                  <img
                    src={`https://cryptoicon-api.vercel.app/api/icon/${item.symbol.toLowerCase()}`}
                    alt={item.name}
                  />
                  <h3>{item.name}</h3>
                </div>
                <i className="xi-angle-right"></i>
              </List>
            </Link>
          ))}
        </Lists>
      )}
    </>
  );
}

export default Home;
