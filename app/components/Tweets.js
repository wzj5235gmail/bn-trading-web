"use client";

import { useEffect, useState, memo } from "react";

function Tweets() {
  const [allTweets, setAllTweets] = useState([]);

  useEffect(() => {
    async function fetchTweets() {
      const res = await fetch("tweets.json");
      let tweets = await res.json();
      tweets = tweets.filter((tweet) => tweet && tweet.createdAt);
      tweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllTweets(tweets);
    }

    fetchTweets();
  }, []);

  return (
    <div
      className="overflow-y-scroll bg-white rounded-lg"
      style={{ height: 500 }}
    >
      {allTweets.map((tweet) => {
        const twitter_href = `https://x.com/${tweet.screen_name}/status/${tweet.id}`;
        const user_href = `https://x.com/${tweet.screen_name}`;
        return (
          <div
            key={tweet.id}
            className="flex flex-col px-8 py-4 border-b-2 gap-2 hover:bg-blue-50"
          >
            <div className="flex justify-between">
              <a href={user_href} target="_blank">
                <div className="font-bold text-blue-500 hover:underline">
                  {tweet.name}
                </div>
              </a>
              <div className="text-gray-400">
                {`${new Date(tweet.createdAt).toLocaleTimeString()} ${new Date(tweet.createdAt).toLocaleDateString()}`}
              </div>
            </div>
            <a href={twitter_href} target="_blank">
              <p className="hover:underline">{tweet.text}</p>
            </a>
            {tweet.quoted && (
              <div className="bg-blue-500 text-white px-4 py-2 rounded-md">
                <p>{tweet.quoted}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default memo(Tweets);
