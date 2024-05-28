const fs = require("fs");

const follows = {
  NateGeraci: "522571568",
  EleanorTerrett: "4182894076",
  JSeyff: "516273728",
  EricBalchunas: "149571760",
  MaoShu_CN: "1589417711754391552",
  Trader_S18: "1663749852965240834",
  ShanghaoJin: "858124064476479488",
  Murphychen888: "972652952098762752",
  OwenJin12: "1530518795508363267",
  Phyrex_Ni: "555634740",
  LabSpeculation: "1481227011100233730",
  xiaomucrypto: "1507631541303713793",
  CryptoHayes: "983993370048630785",
};

const headers = {
  Authorization:
    "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
  "Content-Type": "application/json",
  Cookie:
    '_ga=GA1.2.1788868421.1716097495; g_state={"i_l":0}; dnt=1; kdt=XAzAZvzk95YecQxU5EsV2vDPAf7qpS0qnUL5aPr8; ads_prefs="HBISAAA="; auth_multi="1470696559318683649:23b8a4f9b6349e247da5f16f6be3657a0e66b18b"; auth_token=4fef8a624405dfb94c462ad301fa31e4c9a2f962; guest_id_ads=v1%3A171634800033388663; guest_id_marketing=v1%3A171634800033388663; guest_id=v1%3A171634800033388663; twid=u%3D341510345; ct0=849b1b024b6355c71c1a674c37938de3c2be1ac049fe10baad711050952afcc4720e12e178eae3bc99e46454db28bcf74eac21db55f5fb9c318d98d0dc96bfaae30833e68585069b2fb0b52f9aa4785d; _ga_KEWZ1G5MB3=GS1.2.1716352017.2.0.1716352017.60.0.0; lang=zh-cn; personalization_id="v1_p4mdRSWmwcV+MJdxKIJKhw=="',
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "X-Csrf-Token":
    "849b1b024b6355c71c1a674c37938de3c2be1ac049fe10baad711050952afcc4720e12e178eae3bc99e46454db28bcf74eac21db55f5fb9c318d98d0dc96bfaae30833e68585069b2fb0b52f9aa4785d",
};

async function fetchUserTweets(url) {
  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const entries = data.data.user.result.timeline_v2.timeline.instructions
      .filter((instruction) => instruction.type === "TimelineAddEntries")
      .flatMap((instruction) => instruction.entries);
    const results = entries
      .map((entry) => {
        if (entry.content.entryType === "TimelineTimelineItem") {
          return entry.content.itemContent.tweet_results.result;
        }
      })
      .filter(Boolean);
    const tweetResults = results.map((result) => {
      try {
        return {
          id: result.rest_id,
          name: result.core.user_results.result.legacy.name,
          screen_name: result.core.user_results.result.legacy.screen_name,
          text: result.legacy.full_text,
          quoted:
            result.quoted_status_result && result.quoted_status_result.result
              ? result.quoted_status_result.result.legacy.full_text
              : "",
          createdAt: result.legacy.created_at,
        };
      } catch (error) {
        console.log(result);
        console.error("Error parsing tweet:", error);
      }
    });
    return tweetResults;
  } catch (error) {
    console.error("Error fetching user tweets:", error);
  }
}

function getUserTweetsUrl(userId) {
  const baseUrl =
    "https://x.com/i/api/graphql/gQlOy4mD5C8M8fYxqa0FJg/UserTweets";
  const variables = JSON.stringify({
    userId,
    count: 20,
    includePromotedContent: true,
    withQuickPromoteEligibilityTweetFields: true,
    withVoice: true,
    withV2Timeline: true,
  });
  const features = JSON.stringify({
    rweb_tipjar_consumption_enabled: true,
    responsive_web_graphql_exclude_directive_enabled: true,
    verified_phone_label_enabled: false,
    creator_subscriptions_tweet_preview_api_enabled: true,
    responsive_web_graphql_timeline_navigation_enabled: true,
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    communities_web_enable_tweet_community_results_fetch: true,
    c9s_tweet_anatomy_moderator_badge_enabled: true,
    articles_preview_enabled: true,
    tweetypie_unmention_optimization_enabled: true,
    responsive_web_edit_tweet_api_enabled: true,
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
    view_counts_everywhere_api_enabled: true,
    longform_notetweets_consumption_enabled: true,
    responsive_web_twitter_article_tweet_consumption_enabled: true,
    tweet_awards_web_tipping_enabled: false,
    creator_subscriptions_quote_tweet_preview_enabled: false,
    freedom_of_speech_not_reach_fetch_enabled: true,
    standardized_nudges_misinfo: true,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
    rweb_video_timestamps_enabled: true,
    longform_notetweets_rich_text_read_enabled: true,
    longform_notetweets_inline_media_enabled: true,
    responsive_web_enhance_cards_enabled: false,
  });
  const fieldToggles = JSON.stringify({
    withArticlePlainText: false,
  });
  return `${baseUrl}?variables=${encodeURIComponent(
    variables
  )}&features=${encodeURIComponent(features)}&fieldToggles=${encodeURIComponent(
    fieldToggles
  )}`;
}

async function fetchTweets() {
  const allTweets = [];
  const followIds = Object.values(follows);
  for (const followId of followIds) {
    const tweets = await fetchUserTweets(getUserTweetsUrl(followId));
    if (tweets) {
      allTweets.push(...tweets);
    }
  }
  fs.writeFileSync("./public/tweets.json", JSON.stringify(allTweets, null, 2));
  console.log("Tweets saved to tweets.json");
}

fetchTweets();
