import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import passport from "../utils/passportSetup.js";
import usersService from "../services/users.service.js";
import jwt from "jsonwebtoken";

declare module "express-session" {
  interface SessionData {
    token: string;
  }
}
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.session.token;
  if (!token) return res.redirect("http://localhost:3000/auth/google");

  jwt.verify(token, process.env.JWT_KEY as string, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("http://localhost:3000/auth/google");
    }
    req.user = user;
    next();
  });
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/failure",
});

export const redirectToHome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error("failed to verify user");
    }
    type GoogleUser = {
      id: string;
      _json: {
        picture: string;
        email: string;
      };
    };
    const user = req.user as GoogleUser;
    if (!(await usersService.userExists(user._json.email))) {
      await usersService.addUser(user.id, user._json.email, user._json.picture);
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY as string, {
      expiresIn: "1h", // Token expires in 1 hour
    });
    req.session.token = token; // Store JWT in session
    res.redirect(`${process.env.REDIRECT_URI}/profile`);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

const app = express();
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: process.env.REDIRECT_URI,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
