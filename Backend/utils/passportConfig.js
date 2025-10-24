
import passportLocal from "passport-local";
import User from "../models/User.js";

const LocalStrategy = passportLocal.Strategy;

export default function initialize(passport) {
  passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}

