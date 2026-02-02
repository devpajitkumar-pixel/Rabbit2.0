import redisClient from "../config/redis.js";

export const cacheClear = async (redis, productId) => {
  const keysToDelete = [
    "best-seller",
    "new-arrivals",
    "nav:collection=all|gender=Women",
    "nav:collection=all|gender=Men",
    "nav:collection=all|category=Top Wear",
    "nav:collection=all|category=Bottom Wear",
  ];

  await redisClient.del(keysToDelete);
};
