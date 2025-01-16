import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { auth } from "../services/index.js";
import { SECREATS } from "../config/index.js";

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: SECREATS.GOOGLE_CLIENT_ID,
      clientSecret: SECREATS.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      
      try {
        const newUser = {
          name: profile.name.givenName,
          email: profile.emails[0].value,
          googleId: profile.id,
          profilePicture: profile.photos[0].value,
        };

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Passport.js Configuration
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {

  auth.findUserByGoogleId(user.googleId, (err, user) => done(err, user));
});
