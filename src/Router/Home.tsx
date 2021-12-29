import { motion, useViewportScroll } from "framer-motion";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchAllCoins } from "../api";
import { coinCount, isDark } from "../atom";

interface iCoins {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  text-transform: uppercase;
  font-size: 40px;
  font-weight: 300;
  position: relative;
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
  grid-column: 1 / -1;
  font-size: 30px;
  margin-top: 100px;
  font-weight: 600;
  @media (max-width: 420px) {
    font-size: 20px;
    margin-top: 50px;
  }
`;

const Lists = styled(motion.ul)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, auto));
  gap: 18px;
  margin-bottom: 150px;
  @media (max-width: 420px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, auto));
    gap: 12px;
  }
`;

const List = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 80px;
  background-color: ${(props) => props.theme.cardColor};
  color: ${(props) => props.theme.textColor};
  font-weight: 500;
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
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: ${(props) => props.theme.accentColor};
  }
`;

function Home() {
  const { isLoading, data } = useQuery<iCoins[]>("allCoins", fetchAllCoins);
  const [count, setCount] = useRecoilState(coinCount);
  const { scrollYProgress } = useViewportScroll();
  useEffect(
    () =>
      scrollYProgress.onChange(() =>
        scrollYProgress.get() > 1 ? setCount((prev) => prev + 40) : null
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
        <Lists>
          {data?.slice(0, count)?.map((item) => (
            <Link
              key={item.id}
              to={`/${item.id}`}
              state={{ name: item.name, id: item.id }}
            >
              <List>
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
          <Loader>Loading more coins...</Loader>
        </Lists>
      )}
    </>
  );
}

export default Home;
