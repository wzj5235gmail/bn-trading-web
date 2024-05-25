"use client";

import { memo, useState } from "react";
import { fapiHost } from "../constants";
import {
  NewOrderRespType,
  Order,
  PositionSide,
  PriceMatch,
  Side,
  TimeInForce,
  Type,
  WorkingType,
} from "./interfaces";
import { getSignature, toQueryString } from "../utils";

function OrderPanel() {
  const order = {
    symbol: "",
    side: Side.BUY,
    positionSide: undefined,
    type: Type.LIMIT,
    reduceOnly: undefined,
    quantity: undefined,
    price: undefined,
    newClientOrderId: undefined,
    stopPrice: undefined,
    closePosition: undefined,
    activationPrice: undefined,
    callbackRate: undefined,
    timeInForce: TimeInForce.GTC,
    workingType: undefined,
    priceProtect: undefined,
    newOrderRespType: undefined,
    priceMatch: undefined,
    selfTradePreventionMode: undefined,
    goodTillDate: undefined,
    recvWindow: 5000,
  };

  const [orderInfo, setOrderInfo] = useState(order);

  function placeOrder() {
    const params = toQueryString(orderInfo) + `&timestamp=${Date.now()}`;
    const signature = getSignature(params);
    const orderUrl = `${fapiHost}/fapi/v1/order/test?${params}&signature=${signature}`;
    fetch(orderUrl, {
      method: "POST",
      headers: {
        "X-MBX-APIKEY": String(process.env.NEXT_PUBLIC_API_KEY),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("success: ", res);
      })
      .catch((e) => {
        console.log("error:", e);
      });
  }

  return (
    <div className="p-8 bg-yellow-100">
      <div className="order-panel grid grid-cols-2 gap-4 w-full mb-4">
        <div className="item grid grid-cols-2">
          <label htmlFor="">代码</label>
          <input
            type="text"
            className="border-2 border-black"
            onChange={(e) =>
              setOrderInfo({
                ...orderInfo,
                symbol: e.target.value.toUpperCase(),
              })
            }
          />
        </div>
        <div className="item grid grid-cols-2">
          <label htmlFor="">方向</label>
          <select
            name=""
            id=""
            onChange={(e) =>
              setOrderInfo({ ...orderInfo, side: e.target.value })
            }
          >
            <option value="BUY">买入</option>
            <option value="SELL">卖出</option>
          </select>
        </div>
        {/* <div className="item grid grid-cols-2">
        <label htmlFor="">持仓方向</label>
        <select name="" id="" onChange={e => setOrderInfo({...orderInfo, positionSide: e.target.value})}>
          <option value="BOTH">单向持仓</option>
          <option value="LONG">多头</option>
          <option value="SHORT">空头</option>
        </select>
      </div> */}
        <div className="item grid grid-cols-2">
          <label htmlFor="">订单类型</label>
          <select
            name=""
            id=""
            onChange={(e) =>
              setOrderInfo({ ...orderInfo, type: e.target.value })
            }
          >
            <option value={Type.LIMIT}>限价单</option>
            <option value={Type.MARKET}>市价单</option>
            <option value={Type.STOP}>止损单（限价）</option>
            <option value={Type.STOP_MARKET}>止损单（市价）</option>
            <option value={Type.TAKE_PROFIT}>止盈单（限价）</option>
            <option value={Type.TAKE_PROFIT_MARKET}>止盈单（市价）</option>
            <option value={Type.TRAILING_STOP_MARKET}>
              跟踪止损单（市价）
            </option>
          </select>
        </div>
        {/* <div className="item grid grid-cols-2">
        <label htmlFor="">仅减仓</label>
        <input
          type="checkbox"
          onChange={(e) =>
            setOrderInfo({ ...orderInfo, reduceOnly: e.target.checked })
          }
        />
      </div> */}
        <div className="item grid grid-cols-2">
          <label htmlFor="">下单数量</label>
          <input
            type="number"
            onChange={(e) =>
              setOrderInfo({
                ...orderInfo,
                quantity: parseFloat(e.target.value),
              })
            }
          />
        </div>
        {[Type.LIMIT, Type.STOP, Type.TAKE_PROFIT].includes(orderInfo.type) && (
          <>
            <div className="item grid grid-cols-2">
              <label htmlFor="">价格</label>
              <input
                type="number"
                onChange={(e) =>
                  setOrderInfo({
                    ...orderInfo,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            {!orderInfo.price && (
              <div className="item grid grid-cols-2">
                <label htmlFor="">限价单自动匹配方式</label>
                <select
                  name=""
                  id=""
                  onChange={(e) =>
                    setOrderInfo({ ...orderInfo, priceMatch: e.target.value })
                  }
                >
                  <option value={undefined}>无</option>
                  <option value={PriceMatch.OPPONENT}>对手方1档</option>
                  <option value={PriceMatch.OPPONENT_5}>对手方5档</option>
                  <option value={PriceMatch.OPPONENT_10}>对手方10档</option>
                  <option value={PriceMatch.OPPONENT_20}>对手方20档</option>
                  <option value={PriceMatch.QUEUE}>本方1档</option>
                  <option value={PriceMatch.QUEUE_5}>本方5档</option>
                  <option value={PriceMatch.QUEUE_10}>本方10档</option>
                  <option value={PriceMatch.QUEUE_20}>本方20档</option>
                </select>
              </div>
            )}
          </>
        )}
        {/* <div className="item grid grid-cols-2">
        <label htmlFor="">用户自定义订单号</label>
        <input type="text" onChange={e => setOrderInfo({...orderInfo, newClientOrderId: e.target.value})}/>
      </div> */}
        {[
          Type.STOP,
          Type.STOP_MARKET,
          Type.TAKE_PROFIT,
          Type.TAKE_PROFIT_MARKET,
        ].includes(orderInfo.type) && (
          <>
            <div className="item grid grid-cols-2">
              <label htmlFor="">触发价</label>
              <input
                type="number"
                onChange={(e) =>
                  setOrderInfo({
                    ...orderInfo,
                    stopPrice: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            {/* <div className="item grid grid-cols-2">
            <label htmlFor="">时效策略</label>
            <select
              name=""
              id=""
              onChange={(e) =>
                setOrderInfo({ ...orderInfo, timeInForce: e.target.value })
              }
            >
              <option value={TimeInForce.GTC}>GTC</option>
              <option value={TimeInForce.IOC}>IOC</option>
              <option value={TimeInForce.FOK}>FOK</option>
              <option value={TimeInForce.GTX}>GTX</option>
              <option value={TimeInForce.GTD}>GTD</option>
            </select>
          </div> */}
            {/* <div className="item grid grid-cols-2">
            <label htmlFor="">触发保护</label>
            <input
              type="checkbox"
              onChange={(e) =>
                setOrderInfo({ ...orderInfo, priceProtect: e.target.checked })
              }
            />
          </div> */}
            {/* <div className="item grid grid-cols-2">
            <label htmlFor="">触发类型</label>
            <select
              name=""
              id=""
              onChange={(e) =>
                setOrderInfo({ ...orderInfo, workingType: e.target.value })
              }
            >
              <option value={WorkingType.MARK_PRICE}>标记价格</option>
              <option value={WorkingType.CONTRACT_PRICE}>合约最新价</option>
            </select>
          </div> */}
          </>
        )}
        {[Type.STOP_MARKET, Type.TAKE_PROFIT_MARKET].includes(
          orderInfo.type
        ) && (
          <div className="item grid grid-cols-2">
            <label htmlFor="">全部平仓</label>
            <input
              type="checkbox"
              onChange={(e) =>
                setOrderInfo({ ...orderInfo, closePosition: e.target.checked })
              }
            />
          </div>
        )}
        {orderInfo.type === Type.TRAILING_STOP_MARKET && (
          <>
            <div className="item grid grid-cols-2">
              <label htmlFor="">激活价格</label>
              <input
                type="number"
                onChange={(e) =>
                  setOrderInfo({
                    ...orderInfo,
                    activationPrice: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="item grid grid-cols-2">
              <label htmlFor="">回调比例（%）</label>
              <input
                type="number"
                onChange={(e) =>
                  setOrderInfo({
                    ...orderInfo,
                    callbackRate: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </>
        )}
        {/* <div className="item grid grid-cols-2">
        <label htmlFor="">响应类型</label>
        <select
          name=""
          id=""
          onChange={(e) =>
            setOrderInfo({ ...orderInfo, newOrderRespType: e.target.value })
          }
        >
          <option value={NewOrderRespType.ACK}>ACK</option>
          <option value={NewOrderRespType.RESULT}>RESULT</option>
        </select>
      </div> */}
        {/* <div className="item grid grid-cols-2">
        <label htmlFor="">防自成交模式</label>
        <select name="" id="" onChange={e => setOrderInfo({...orderInfo, selfTradePreventionMode: e.target.value})}>
          <option value="NONE">无</option>
          <option value="EXPIRE_TAKER">取消taker订单</option>
          <option value="EXPIRE_MAKER">取消maker订单</option>
          <option value="EXPIRE_BOTH">取消所有订单</option>
        </select>
      </div> */}
        {orderInfo.timeInForce === TimeInForce.GTD && (
          <div className="item grid grid-cols-2">
            <label htmlFor="">自动取消时间</label>
            <input
              type="number"
              onChange={(e) =>
                setOrderInfo({
                  ...orderInfo,
                  goodTillDate: parseInt(e.target.value),
                })
              }
            />
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => {
            console.log(orderInfo);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          提交订单
        </button>
      </div>
    </div>
  );
}

export default memo(OrderPanel);
