"use client";

import { useEffect, useState } from "react";
import { fapiHost } from "../constants";
import { getSignature } from "../utils";

const accountUrl = "/fapi/v2/account";

export default function Header() {
  const [btcPrice, setBtcPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [totalExposure, setTotalExposure] = useState(0);
  const [totalGains, setTotalGains] = useState(0);

  function getProfit() {
    const queryString = `timestamp=${Date.now()}&recvWindow=5000`;
    fetch(
      `${fapiHost}${accountUrl}?${queryString}&signature=${getSignature(
        queryString
      )}`,
      {
        method: "GET",
        headers: {
          "X-MBX-APIKEY": String(process.env.NEXT_PUBLIC_API_KEY),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalGains(data.totalUnrealizedProfit);
      });
  }

  useEffect(() => {
    function subscribeToPrices() {
      const wsUrl =
        "wss://fstream.binance.com/stream?streams=btcusdt@aggTrade/ethusdt@aggTrade";
      const ws = new WebSocket(wsUrl);

      ws.onopen = function () {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = function (event) {
        const message = JSON.parse(event.data);
        if (message.stream && message.data && message.data.p) {
          const symbol = message.data.s;
          const price = message.data.p;
          // console.log(`Latest price for ${symbol}: ${price}`);
          if (symbol === "BTCUSDT") {
            setBtcPrice(price);
          } else if (symbol === "ETHUSDT") {
            setEthPrice(price);
          }
        }
      };

      ws.onping = function (event) {
        ws.pong(event.data);
        console.log("Received ping, sent pong");
      };

      ws.onclose = function () {
        console.log("WebSocket connection closed, reconnecting...");
        setTimeout(subscribeToPrices, 1000); // Reconnect after 1 second
      };

      ws.onerror = function (error) {
        console.error("WebSocket error:", error);
      };
    }
    subscribeToPrices();
    getProfit();
  }, []);

  return (
    <div className="header grid grid-cols-4 sticky text-xl mt-6 w-full font-bold bg-yellow-100 p-8">
      <div className="btc-price grid grid-cols-2">
        <div>BTC</div>
        <div className="text-red-600">{btcPrice}</div>
      </div>
      <div className="btc-price grid grid-cols-2">
        <div>ETH</div>
        <div className="text-red-600">{ethPrice}</div>
      </div>
      <div className="btc-price grid grid-cols-2">
        <div>Exposure</div>
        <div className="text-red-600">{Number(totalGains).toFixed(2)}</div>
      </div>
      <div className="btc-price grid grid-cols-2">
        <div>Profit</div>
        <div className="text-red-600">{Number(totalGains).toFixed(2)}</div>
      </div>
    </div>
  );
}
