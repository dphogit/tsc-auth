import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";

import User from "../entities/User";

const SECRET = <string>process.env.JWT_SECRET;
const EXPIRE = 86400000;

class UserController {
  public async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const userRepository = getRepository(User);
    const newUser = new User();
    newUser.email = email;

    try {
      const userExists = await userRepository.findOne({ email });
      if (userExists) {
        res.status(400).json({
          status: "fail",
          data: {
            reason: `User with email ${email} already exists.`,
          },
        });
      }

      newUser.password = await bcrypt.hash(password, 12);
      await userRepository.save(newUser);

      res.status(200).json({ status: "success", data: { newUser } });
    } catch (error) {
      const { message, stack } = new Error(error);
      console.error("Error in User Signup (Local): " + stack);
      res.status(500).json({ status: "error", message, data: stack });
    }
  }

  public authenticate(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          status: "failed",
          data: {
            reason: "Unauthorized",
          },
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
      });

      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        SECRET,
        { expiresIn: EXPIRE }
      );

      res.status(200).json({
        status: "success",
        data: {
          token: token,
          userId: user.userId,
          expiresInMilliSeconds: EXPIRE,
        },
      });
    })(req, res, next);
  }
}

export default UserController;
