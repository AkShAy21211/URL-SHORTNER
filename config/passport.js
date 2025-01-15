import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { auth } from "../services/index.js";

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        
        const existingUser = await auth.findUserByGoogleId(profile.id);
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await auth.createUser({
          name: profile.name.givenName,
          email: profile.emails[0].value,
          googleId: profile.id,
          profilePicture: profile.photos[0].value,
        });

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
// Passport.js Configuration
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

