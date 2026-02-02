import { emailQueue } from "../queues/emailQueue.js";

export const sendEmailController = async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Add job to Bull queue
    await emailQueue.add({ to, subject, html });

    res.json({ success: true, message: "Email queued successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to queue email" });
  }
};
