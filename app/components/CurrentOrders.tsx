"use client";

import { memo } from "react";
import { Order } from "./interfaces";

interface CurrentOrder extends Order {
  origQty: number
  status: string
  orderId: number
};

interface CurrentOrdersProps {
  currentOrders: CurrentOrder[];
  cancelOrder: (symbol: string, orderId: number) => void;
  cancelAllOrders: (symbol: string) => void;
}

const CurrentOrders: React.FC<CurrentOrdersProps> = ({ currentOrders, cancelOrder, cancelAllOrders }) => {
  const orderColumns: (keyof CurrentOrder)[] = [
    "symbol",
    "type",
    "side",
    "positionSide",
    "price",
    "origQty",
    "status",
  ];

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h2 className="text-xl mb-4 font-bold">有效委托</h2>
      {currentOrders.length > 0 ? (
        <table className="table-auto w-full mt-8">
          <thead>
            <tr>
              {orderColumns.map((title) => (
                <th key={title} className="border-2 border-black">{title}</th>
              ))}
              <th className="border-2 border-black">操作</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.orderId}>
                {orderColumns.map((key) => (
                  <td key={key} className="border-2 border-black text-center">
                    {order[key]}
                  </td>
                ))}
                <td className="border-2 border-black text-center">
                  <button
                    className="bg-red-600 text-white"
                    onClick={() => cancelOrder(order.symbol, order.orderId)}
                  >
                    取消订单
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center mt-4">暂无有效订单</div>
      )}
      <button
        className="self-end bg-red-600 text-white"
        onClick={() => {
          currentOrders.forEach((order) => {
            cancelAllOrders(order.symbol);
          });
        }}
      >
        取消所有订单
      </button>
    </div>
  );
}

export default memo(CurrentOrders);