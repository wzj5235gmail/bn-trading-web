"use client";

import { memo, useState, useEffect } from "react";
import { fapiHost } from "../constants";
import {
  CurrentOrder,
  Order,
  PositionSide,
  Side,
  TimeInForce,
  Type
} from "./interfaces";
import { getSignature, toQueryString } from "../utils";
import PlaceOrder from "./PlaceOrder";
import CurrentOrders from "./CurrentOrders";

const initialOrder = {
  symbol: "",
  side: Side.BUY,
  positionSide: PositionSide.LONG,
  type: Type.LIMIT,
  timeInForce: TimeInForce.GTC,
  recvWindow: 5000,
};

function Orders() {
  const [orderInfo, setOrderInfo] = useState<Order>(initialOrder); // 修改了这里的类型声明
  const [currentOrders, setCurrentOrders] = useState<CurrentOrder[]>([]); // 修改了这里的类型声明
  const [symbols, setSymbols] = useState<string[]>([]); // 修改了这里的类型声明

  const placeOrder = () => {
    const params = toQueryString(orderInfo) + `&timestamp=${Date.now()}`;
    const signature = getSignature(params);
    const orderUrl = `${fapiHost}/fapi/v1/order?${params}&signature=${signature}`;
    fetch(orderUrl, {
      method: "POST",
      headers: {
        "X-MBX-APIKEY": String(process.env.NEXT_PUBLIC_API_KEY),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("success: ", res);
        getCurrentOrders();
      })
      .catch((e) => {
        console.log("error:", e);
      });
  };

  const getCurrentOrders = () => {
    const params = `timestamp=${Date.now()}&recvWindow=5000`;
    const signature = getSignature(params);
    const currentOrdersUrl = `${fapiHost}/fapi/v1/openOrders?${params}&signature=${signature}`;
    fetch(currentOrdersUrl, {
      method: "GET",
      headers: {
        "X-MBX-APIKEY": String(process.env.NEXT_PUBLIC_API_KEY),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("success: ", res);
        setCurrentOrders(res);
      })
      .catch((e) => {
        console.log("error:", e);
      });
  };

  const cancelOrder = (symbol: string, id: number) => {
    const params = `timestamp=${Date.now()}&recvWindow=5000&symbol=${symbol}&orderId=${id}`;
    const signature = getSignature(params);
    const cancelOrderUrl = `${fapiHost}/fapi/v1/order?${params}&signature=${signature}`;
    fetch(cancelOrderUrl, {
      method: "DELETE",
      headers: {
        "X-MBX-APIKEY": String(process.env.NEXT_PUBLIC_API_KEY),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("success: ", res);
        getCurrentOrders();
      })
      .catch((e) => {
        console.log("error:", e);
      });
  };

  const cancelAllOrders = (symbol: string) => {
    const params = `timestamp=${Date.now()}&recvWindow=5000&symbol=${symbol}`;
    const signature = getSignature(params);
    const cancelOrderUrl = `${fapiHost}/fapi/v1/allOpenOrders?${params}&signature=${signature}`;
    fetch(cancelOrderUrl, {
      method: "DELETE",
      headers: {
        "X-MBX-APIKEY": String(process.env.NEXT_PUBLIC_API_KEY),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("success: ", res);
        getCurrentOrders();
      })
      .catch((e) => {
        console.log("error:", e);
      });
  };

  const getSymbols = () => {
    const getSymbolsUrl = `${fapiHost}/fapi/v1/exchangeInfo`;
    fetch(getSymbolsUrl)
      .then((res) => res.json())
      .then((res) => {
        console.log("success: ", res);
        setSymbols(res.symbols.map((i: any) => i.symbol));
      })
      .catch((e) => {
        console.log("error:", e);
      });
  };

  useEffect(() => {
    getCurrentOrders();
    getSymbols();
  }, []);

  const props = {
    setOrderInfo,
    orderInfo,
    symbols,
    placeOrder,
    currentOrders,
    cancelOrder,
    cancelAllOrders,
  };

  return (
    <div className="p-4 border-blue-400 border-4 border-collapse">
      <PlaceOrder {...props} />
      <CurrentOrders {...props} />
    </div>
  );
}

export default memo(Orders);