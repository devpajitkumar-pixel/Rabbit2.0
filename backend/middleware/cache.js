const cache = (keyBuilder, ttl = 600) => {
  return async (req, res, next) => {
    try {
      const key =
        typeof keyBuilder === "function" ? keyBuilder(req) : keyBuilder;

      const cachedData = await req.redis.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Monkey-patch res.json
      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        await req.redis.setEx(key, ttl, JSON.stringify(body));
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Redis cache error:", err);
      next();
    }
  };
};

export default cache;
