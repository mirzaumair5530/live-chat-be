import type { Application, NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import bcrypt from "bcrypt";

import usersModel from "./models/users.model";

export class Authentication {
  constructor(app: Application) {
    app.use(
      session({
        secret: process.env.SECRET || "6cee9081-94ba-4e51-89dd-37f7ab25e3c8",
        resave: false,
        saveUninitialized: false,
      })
    );
    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());
  }

  public setupLocalStratigy() {
    passport.use(
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
        },
        async (username, password, done) => {
          try {
            console.log(username, password);
            const user = await usersModel.findOne({ email: username });

            if (!user) {
              return done(null, false, { message: "Incorrect username." });
            }
            const match = bcrypt.compare(password, user.password as string);
            if (!match) {
              return done(null, false, { message: "Incorrect password." });
            }
            done(null, user);
          } catch (error: any) {
            done(error, false, { message: error.message });
          }
        }
      )
    );

    passport.serializeUser((user: any, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id: any, done) => {
      const user = usersModel.findById(id);
      done(null, user);
    });
  }

  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).send({ message: "You are not authorized!" });
    }
  }
}
