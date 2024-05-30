function News() {
  return (
    <div className="news-and-calendar grid grid-row-2 gap-8">
      <div className="news">
        <iframe
          src="https://wallstreetcn.com/live/us-stock"
          style={{height: 500, width: '100%'}}
        ></iframe>
      </div>
      <div className="calendar">
        <iframe
          src="https://wallstreetcn.com/calendar"
          style={{height: 500, width: '100%'}}
        ></iframe>
      </div>
    </div>
  );
}

export default News;
