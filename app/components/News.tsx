function News() {
  return (
    <div className="news-and-calendar flex justify-between gap-8">
      <div className="news">
        <iframe
          src="https://wallstreetcn.com/live/us-stock"
          height={500}
          width={500}
        ></iframe>
      </div>
      <div className="calendar">
        <iframe
          src="https://wallstreetcn.com/calendar"
          height={500}
          width={500}
        ></iframe>
      </div>
    </div>
  );
}

export default News;
