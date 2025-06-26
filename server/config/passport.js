import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/user/oauth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "oauth_placeholder",
          });
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        user.token = token;

        return done(null,user);
      } catch (error) {
        return done(error,null);
      }
    }
  )
);
