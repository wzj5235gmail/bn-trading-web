

// import TradingViewWidget from "./components/tv"
import News from "./components/News";
import Orders from "./components/Orders";
import Header from "./components/Header";
import BinanceChart from "./components/OpenInterestHist";
import Tweets from "./components/Tweets";

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col gap-8">
      <Header />
      <Tweets />
      <News />
      {/* <div className="trading-view">
        <TradingViewWidget />
      </div> */}
      <div className="chatgpt">
      </div>
      <div className="order">
        <Orders />
      </div>
      <div className="open-interest-hist">
        <BinanceChart />
      </div>
    </main>
  );
}
