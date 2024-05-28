import { memo } from "react";
import {
  Order,
  PositionSide,
  PriceMatch,
  Side,
  TimeInForce,
  Type
} from "./interfaces";
import SymbolSearch from "./SymbolSearch";

interface PlaceOrderProps {
  setOrderInfo: (orderInfo: Order) => void;
  orderInfo: Order;
  placeOrder: () => void;
  symbols: string[];
}

const PlaceOrder: React.FC<PlaceOrderProps> = ({ setOrderInfo, orderInfo, placeOrder, symbols }) => {
  const props = {
    setOrderInfo: setOrderInfo,
    orderInfo: orderInfo,
    symbols: symbols,
  };

  return (
    <>
      <h2 className="text-xl mb-4 font-bold">下订单</h2>
      <div className="order-panel grid grid-cols-2 gap-4 w-full mb-4">
        <div className="item grid grid-cols-2">
          <label htmlFor="">代码</label>
          <SymbolSearch {...props} />
        </div>
        <div className="item grid grid-cols-2">
          <label htmlFor="">方向</label>
          <select
            onChange={(e) =>
              setOrderInfo({ ...orderInfo, side: e.target.value as Side })
            }
          >
            <option value="BUY">买入</option>
            <option value="SELL">卖出</option>
          </select>
        </div>
        <div className="item grid grid-cols-2">
          <label htmlFor="">持仓方向</label>
          <select
            onChange={(e) =>
              setOrderInfo({ ...orderInfo, positionSide: e.target.value as PositionSide })
            }
          >
            <option value={PositionSide.LONG}>多头</option>
            <option value={PositionSide.SHORT}>空头</option>
          </select>
        </div>
        <div className="item grid grid-cols-2">
          <label htmlFor="">订单类型</label>
          <select
            onChange={(e) =>
              setOrderInfo({ ...orderInfo, type: e.target.value as Type })
            }
          >
            <option value={Type.LIMIT}>限价单</option>
            <option value={Type.MARKET}>市价单</option>
            <option value={Type.STOP}>止损单（限价）</option>
            <option value={Type.STOP_MARKET}>止损单（市价）</option>
            <option value={Type.TAKE_PROFIT}>止盈单（限价）</option>
            <option value={Type.TAKE_PROFIT_MARKET}>止盈单（市价）</option>
            <option value={Type.TRAILING_STOP_MARKET}>跟踪止损单（市价）</option>
          </select>
        </div>
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
                  onChange={(e) =>
                    setOrderInfo({ ...orderInfo, priceMatch: e.target.value as PriceMatch })
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
          </>
        )}
        {[Type.STOP_MARKET, Type.TAKE_PROFIT_MARKET].includes(orderInfo.type) && (
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
          onClick={placeOrder}
          className="bg-green-600 text-white"
        >
          提交订单
        </button>
      </div>
    </>
  );
}

export default memo(PlaceOrder);