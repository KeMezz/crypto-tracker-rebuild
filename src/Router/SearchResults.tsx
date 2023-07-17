import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchSearch } from "../api";

interface iData {
  currencies: [
    | {
        id: string;
        is_active: boolean;
        is_new: boolean;
        name: string;
        rank: number;
        rev: number;
        symbol: string;
        type: string;
      }
    | undefined
  ];
}
const Loader = styled.h2`
  text-align: center;
  font-size: 18px;
`;
const Container = styled.section``;
const Results = styled(motion.ul)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, auto));
  gap: 18px;
  margin-bottom: 150px;
  @media (max-width: 420px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, auto));
    gap: 12px;
  }
`;
const Result = styled(motion.li)`
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

function SearchResults() {
  const { searchId } = useParams();
  const { isLoading, data } = useQuery<iData>(
    [searchId, "search"],
    () => fetchSearch(searchId + ""),
    {
      onError: () => {
        console.log("error occured!");
      },
    }
  );
  console.log(data?.currencies[0]?.name);
  return (
    <Container>
      {isLoading ? (
        <Loader>Searching...</Loader>
      ) : data?.currencies[0] ? (
        <Results>
          {data?.currencies.map((result) => (
            <Link to={`/${result?.id}`}>
              <Result>
                <div className="left">
                  <img
                    src={`https://coinicons-api.vercel.app/api/icon/${result?.symbol.toLowerCase()}`}
                    alt={result?.name}
                  />
                  <h3>{result?.name}</h3>
                </div>
                <i className="xi-angle-right"></i>
              </Result>
            </Link>
          ))}
        </Results>
      ) : (
        <Loader>No Results</Loader>
      )}
    </Container>
  );
}

export default SearchResults;
