"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  TimeScale,
  Zoom,
} from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

const BinanceChart = () => {
  const [klineData, setKlineData] = useState([]);
  const [openInterestData, setOpenInterestData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interval, setMyInterval] = useState("4h");
  const [limit, setLimit] = useState(180);

  useEffect(() => {
    const fetchKlineData = async () => {
      const symbol = "BTCUSDT";
      const klineResponse = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      const klineData = await klineResponse.json();

      const klineFormatted = klineData.map((item) => ({
        time: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      }));

      setKlineData(klineFormatted);
    };

    const fetchOpenInterestData = async () => {
      const symbol = "BTCUSDT";
      const openInterestResponse = await fetch(
        `https://fapi.binance.com/futures/data/openInterestHist?symbol=${symbol}&period=${interval}&limit=${limit}`
      );
      const openInterestData = await openInterestResponse.json();

      const openInterestFormatted = openInterestData.map((item) => ({
        time: item.timestamp,
        openInterest: parseFloat(item.sumOpenInterest),
      }));

      setOpenInterestData(openInterestFormatted);
    };

    const fetchData = async () => {
      await fetchKlineData();
      await fetchOpenInterestData();
      setIsLoading(false);
    };

    fetchData();
  }, [interval]);

  useEffect(() => {
    if (!isLoading && klineData.length && openInterestData.length) {
      const labels = klineData.map((item) => new Date(item.time));

      const klineDataset = {
        label: "BTC价格",
        data: klineData.map((item) => item.close),
        backgroundColor: "rgba(214, 81, 64, 1)",
        borderColor: "rgba(214, 81, 64, 1)",
        borderWidth: 1,
        yAxisID: "y-axis-1",
        type: "line",
      };

      const openInterestDataset = {
        label: "BTC合约持仓量",
        data: openInterestData.map((item) => item.openInterest),
        backgroundColor: "rgba(82, 156, 83, 0.3)",
        borderColor: "rgba(82, 156, 83, 0.3)",
        borderWidth: 1,
        yAxisID: "y-axis-2",
        type: "bar",
      };

      setChartData({
        labels: labels,
        datasets: [klineDataset, openInterestDataset],
      });
    }
  }, [klineData, openInterestData, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function handleIntervalChg(e) {
    const currInterval = e.target.value;
    switch (currInterval) {
      case "4h":
        setMyInterval("4h");
        setLimit(180);
        break;
      case "15m":
        setMyInterval("15m");
        setLimit(500);
        break;
      case "1h":
        setMyInterval("1h");
        setLimit(500);
        break;
      default:
        setMyInterval("4h");
        setLimit(180);
        break;
    }
  }

  return (
    <div>
      <div className="flex gap-6">
        <h2>价格与合约持仓量</h2>
        <select onChange={(e) => handleIntervalChg(e)}>
          <option value="4h">4小时</option>
          <option value="15m">15分钟</option>
          <option value="1h">1小时</option>
        </select>
      </div>
      {chartData && (
        <Line
          data={chartData}
          options={{
            scales: {
              "y-axis-1": {
                type: "linear",
                position: "left",
                ticks: {
                  beginAtZero: false,
                },
                title: {
                  display: true,
                  text: "BTC价格",
                },
              },
              "y-axis-2": {
                type: "linear",
                position: "right",
                ticks: {
                  beginAtZero: true,
                },
                title: {
                  display: true,
                  text: "BTC合约持仓量",
                },
              },
              x: {
                type: "time",
                time: {
                  unit: "hour",
                  tooltipFormat: "MMM dd, h:mm a",
                  displayFormats: {
                    hour: "MMM dd, h:mm a",
                  },
                },
              },
            },
            plugins: {
              zoom: {
                pan: {
                  enabled: true,
                  mode: "x",
                },
                zoom: {
                  enabled: true,
                  mode: "x",
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true,
                  },
                  mode: "x",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default BinanceChart;
