import passport from "passport";
import passportLocal from "passport-local";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";

import User from "../entities/User";

const LocalStrategy = passportLocal.Strategy;

export function sessionSetup() {
  passport.serializeUser((user, done) => {
    console.log("Serialize: " + (user as User).userId);
    done(null, (user as User).userId);
  });

  passport.deserializeUser((id: number, done) => {
    console.log("Deserialize: " + id);
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
      (username, password, done) => {
        const userRepo = getRepository(User);

        userRepo
          .findOne({ email: username })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "No user with that email" });
            }

            bcrypt.compare(password, user.password).then((match) => {
              if (!match) {
                return done(null, false, {
                  message: "Not a matching password",
                });
              }
              return done(null, user);
            });
          })
          .catch((err) => done(err));
      }
    )
  );
}
