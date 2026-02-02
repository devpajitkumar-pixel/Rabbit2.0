import Queue from "bull";
import { sendEmail } from "../utils/email.js";

// Connect to Redis
export const emailQueue = new Queue("email", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// Worker to process email jobs
emailQueue.process(async (job) => {
  try {
    await sendEmail(job.data);
  } catch (error) {
    throw error;
  }
});
