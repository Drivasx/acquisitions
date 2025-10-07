import arcjet, { shield, detectBot, tokenBucket, slidingWindow } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";


const aj = arcjet({

  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
        "CATEGORY:PREVIEW",
      ],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: 2, // Check every 2 seconds
      max: 5
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;