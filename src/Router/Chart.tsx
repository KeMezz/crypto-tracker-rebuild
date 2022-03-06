import { useQuery } from "react-query";
import { fetchOHLCV } from "../api";
import styled from "styled-components";
import ApexChart from "react-apexcharts";

interface iChart {
  coinId?: string;
}

interface iOHLCV {
  close: number;
  high: number;
  low: number;
  market_cap: number;
  open: number;
  time_close: string;
  time_open: string;
  volume: number;
}

const Loader = styled.div`
  text-align: center;
  margin: 30px 0;
  font-size: 18px;
`;

function Chart({ coinId }: iChart) {
  const { isLoading, data } = useQuery<iOHLCV[]>([coinId, "OHLCV"], () =>
    fetchOHLCV(coinId)
  );
  return (
    <>
      {isLoading ? (
        <Loader>Loading Charts...</Loader>
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: data?.map((price) => {
                return {
                  x: price.time_close,
                  y: [price.open, price.high, price.low, price.close],
                };
              }),
            },
          ]}
          options={{
            chart: {
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            xaxis: {
              type: "datetime",
              categories: data?.map((item) => item.time_close),
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
            },
            yaxis: {
              show: false,
            },
            grid: {
              show: false,
            },
          }}
        />
      )}
    </>
  );
}

export default Chart;
