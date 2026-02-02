import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/user.js";
import { emailQueue } from "../queues/emailQueue.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        // 🔗 Existing user → link Google
        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = "google";
            await user.save();
          }
        }
        // 🆕 New Google user
        else {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            authProvider: "google",
          });
          // Queue welcome email
          await emailQueue.add({
            to: email,
            subject: "Welcome to Rabbit",
            html: `<p>Hi ${profile.displayName}, welcome to Rabbit! Your account has been created successfully.</p>`,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);
