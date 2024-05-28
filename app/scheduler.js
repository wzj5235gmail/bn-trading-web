// scheduler.js
const fetchTweets = require("./fetchTweets");
const interval = 60000; // 60秒

const startScheduler = () => {
  setInterval(() => {
    fetchTweets();
  }, interval);
};

module.exports = { startScheduler };
