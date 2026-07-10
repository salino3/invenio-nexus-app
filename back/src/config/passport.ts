import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../constants";
import { Account } from "../models/account.model";
import bcrypt from "bcryptjs";
import { RegistretionAccountDB } from "../interfaces/account.interface";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      callbackURL: GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        // 1. Check if user exists
        let user = await Account.findActiveByEmail(email);

        if (!user) {
          // 2. Create user if not exists
          const randomPassword = Math.random().toString(36).slice(-16);
          const passwordHash = await bcrypt.hash(randomPassword, 10);

          const accountInput: RegistretionAccountDB = {
            name: profile.displayName || "Google User",
            email: email,
            password: passwordHash,
            age: 18, // Default age for OAuth users
          };

          user = await Account.createAccount(accountInput);

          // For avoid error with concurrence
          if (!user) {
            user = await Account.findActiveByEmail(email);
          }
        }

        if (!user) {
          return done(
            new Error("Failed to process or retrieve Google account context"),
            undefined,
          );
        }

        // Return the user object (AccountCookie compatible)
        return done(null, {
          id: user.id,
          name: user.name,
          email: user.email,
          role_user: user.role_user,
        });
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);

export default passport;
