

// import TradingViewWidget from "./components/tv"
import OrderPanel from "./components/orderPanel"
import Header from "./components/header"
import BinanceChart from "./components/openInterestHist"

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col gap-8">
      <Header />
      <div className="news-and-calendar flex justify-between">
        <div className="news">
          <iframe src="https://wallstreetcn.com/live/us-stock" height={500} width={675}></iframe>
        </div>
        <div className="calendar">
          <iframe src="https://wallstreetcn.com/calendar" height={500} width={675}></iframe>
        </div>
      </div>
      {/* <div className="trading-view">
        <TradingViewWidget />
      </div> */}
      <div className="chatgpt">

      </div>
      <div className="order">
        <OrderPanel />
      </div>
      <div className="trades"></div>
      <div className="open-interest-hist">
        <BinanceChart />
      </div>
    </main>
  );
}
