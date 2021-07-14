import passport from "passport";
import passportLocal from "passport-local";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";

import User from "../entities/User";

const LocalStrategy = passportLocal.Strategy;

export function sessionSetup() {
  passport.serializeUser((user, done) => {
    done(null, (user as User).userId);
  });

  passport.deserializeUser((id: number, done) => {
    const userRepo = getRepository(User);
    userRepo
      .findOne(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });
}

export function localStrategySetup() {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (username, password, done) => {
        const userRepo = getRepository(User);

        try {
          const user = await userRepo.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }

          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}
