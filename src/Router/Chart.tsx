import { useQuery } from "react-query";
import { fetchOHLCV } from "../api";
import styled from "styled-components";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDark } from "../atom";

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
  const dark = useRecoilValue(isDark);
  const { isLoading, data } = useQuery<iOHLCV[]>([coinId, "OHLCV"], () =>
    fetchOHLCV(coinId)
  );
  return (
    <>
      {isLoading ? (
        <Loader>Loading Charts...</Loader>
      ) : (
        <ApexChart
          options={{
            chart: {
              height: 100,
              background: "transparent",
              type: "line",
              toolbar: {
                show: false,
              },
            },
            theme: {
              mode: dark ? "dark" : "light",
            },
            stroke: { curve: "smooth" },
            grid: { show: false },
            yaxis: {
              show: false,
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
            xaxis: {
              type: "datetime",
              categories: data?.map((item) => item.time_close),
              labels: { show: false },
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["blue"], stops: [0, 100] },
            },
            tooltip: { y: { formatter: (price) => `$${price.toFixed(3)}` } },
          }}
          series={[
            {
              name: "Price",
              data: data?.map((item) => item.close),
            },
          ]}
        />
      )}
    </>
  );
}

export default Chart;
