export interface Order {
  symbol: string; //交易对
  side: Side; //买卖方向 SELL, BUY
  positionSide?: PositionSide; //持仓方向，单向持仓模式下非必填，默认且仅可填BOTH;在双向持仓模式下必填,且仅可选择 LONG 或 SHORT
  type: Type; //订单类型 LIMIT, MARKET, STOP, TAKE_PROFIT, STOP_MARKET, TAKE_PROFIT_MARKET, TRAILING_STOP_MARKET
  reduceOnly?: boolean; //true, false; 非双开模式下默认false；双开模式下不接受此参数； 使用closePosition不支持此参数。
  quantity?: number; //下单数量,使用closePosition不支持此参数。
  price?: number;
  newClientOrderId?: string; //用户自定义的订单号，不可以重复出现在挂单中。如空缺系统会自动赋值。必须满足正则规则 ^[\.A-Z\:/a-z0-9_-]{1,36}$
  stopPrice?: number; //触发价, 仅 STOP, STOP_MARKET, TAKE_PROFIT, TAKE_PROFIT_MARKET 需要此参数
  closePosition?: boolean; //true, false；触发后全部平仓，仅支持STOP_MARKET和TAKE_PROFIT_MARKET；不与quantity合用；自带只平仓效果，不与reduceOnly 合用
  activationPrice?: number; //追踪止损激活价格，仅TRAILING_STOP_MARKET 需要此参数, 默认为下单当前市场价格(支持不同workingType)
  callbackRate?: number; //追踪止损回调比例，可取值范围[0.1, 10],其中 1代表1% ,仅TRAILING_STOP_MARKET 需要此参数
  timeInForce?: TimeInForce; //订单保持有效的条件
  workingType?: WorkingType; //stopPrice 触发类型: MARK_PRICE(标记价格), CONTRACT_PRICE(合约最新价). 默认 CONTRACT_PRICE
  priceProtect?: boolean; //条件单触发保护："TRUE","FALSE", 默认"FALSE". 仅 STOP, STOP_MARKET, TAKE_PROFIT, TAKE_PROFIT_MARKET 需要此参数
  newOrderRespType?: string; //"ACK", "RESULT", 默认 "ACK"
  priceMatch?: PriceMatch; //OPPONENT/ OPPONENT_5/ OPPONENT_10/ OPPONENT_20/QUEUE/ QUEUE_5/ QUEUE_10/ QUEUE_20；不能与price同时传
  selfTradePreventionMode?: SelfTradePreventionMode; //NONE / EXPIRE_TAKER/ EXPIRE_MAKER/ EXPIRE_BOTH； 默认NONE
  goodTillDate?: number; //TIF为GTD时订单的自动取消时间， 当timeInforce为GTD时必传；传入的时间戳仅保留秒级精度，毫秒级部分会被自动忽略，时间戳需大于当前时间+600s且小于253402300799000
  recvWindow?: number;
}

export enum Side {
  SELL = "SELL",
  BUY = "BUY"
}

export enum PositionSide {
  BOTH = "BOTH",
  LONG = "LONG",
  SHORT = "SHORT"
}

export enum Type {
  LIMIT = "LIMIT",
  MARKET = "MARKET",
  STOP = "STOP",
  TAKE_PROFIT = "TAKE_PROFIT",
  STOP_MARKET = "STOP_MARKET",
  TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET",
  TRAILING_STOP_MARKET = "TRAILING_STOP_MARKET"
}

export enum WorkingType {
  MARK_PRICE = "MARK_PRICE", CONTRACT_PRICE = "CONTRACT_PRICE"
}

export enum NewOrderRespType {
  ACK = "ACK", RESULT = "RESULT"
}

export enum PriceMatch {
  OPPONENT = "OPPONENT",
  OPPONENT_5 = "OPPONENT_5",
  OPPONENT_10 = "OPPONENT_10",
  OPPONENT_20 = "OPPONENT_20",
  QUEUE = "QUEUE",
  QUEUE_5 = "QUEUE_5",
  QUEUE_10 = "QUEUE_10",
  QUEUE_20 = "QUEUE_20"
}

export enum SelfTradePreventionMode {
  NONE = "NONE",
  EXPIRE_TAKER = "EXPIRE_TAKER",
  EXPIRE_MAKER = "EXPIRE_MAKER",
  EXPIRE_BOTH = "EXPIRE_BOTH"
}

export enum TimeInForce {
  GTC = "GTC", // - Good Till Cancel 成交为止（下单后仅有1年有效期，1年后自动取消）
  IOC = "IOC", // - Immediate or Cancel 无法立即成交(吃单)的部分就撤销
  FOK = "FOK", // - Fill or Kill 无法全部立即成交就撤销
  GTX = "GTX", // - Good Till Crossing 无法成为挂单方就撤销
  GTD = "GTD", // - Good Till Date 在特定时间之前有效，到期自动撤销
}

export interface CurrentOrder extends Order {
  origQty: number
  status: string
  orderId: number
};