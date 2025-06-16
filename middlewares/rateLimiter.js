import ratelimit from "../lib/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit(req.ip);
    if (!success) {
      return res
        .status(429)
        .json({ error: "Too many requests, please try again later." });
    }

    next();
  } catch (error) {
    console.error("Error in rateLimiter:", error);
    return next(error);
  }
};

export default rateLimiter;
