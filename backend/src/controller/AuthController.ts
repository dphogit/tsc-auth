import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import passport from "passport";
import { sign } from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../entities/User";

class UserController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const failures = errors.array();
      res.status(400).json({
        status: "fail",
        data: {
          allErrors: failures,
          reason: failures[0].msg,
        },
      });
      return;
    }

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
        return;
      }

      newUser.password = await bcrypt.hash(password, 12);
      await userRepository.save(newUser);

      res.status(200).json({ status: "success", data: { newUser } });
    } catch (error) {
      next(error);
    }
  }

  public isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
      res
        .status(400)
        .json({ status: "fail", data: { reason: "Not authenticated." } });
      return;
    }

    next();
  }

  public authenticateLocal(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          status: "fail",
          data: {
            reason: "Incorrect login",
          },
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
      });

      const EXPIRE = 1000 * 60 * 30; // 30 mins

      const token = sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: EXPIRE.toString() }
      );

      res.status(200).json({
        status: "success",
        data: {
          userId: user.userId,
          token: token,
          expiresInMs: EXPIRE,
        },
      });
    })(req, res, next);
  }

  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", (err, user) => {
      if (err) {
        console.log(err);
        throw err;
      }

      if (!user) {
        res.status(401).json({
          status: "fail",
          data: {
            reason: "Unauthorized",
          },
        });
        return;
      }

      req.user = user;
      next();
    })(req, res, next);
  }

  public logout(req: Request, res: Response, _next: NextFunction) {
    const user = req.user as User;
    if (!user) {
      res.status(400).json({
        status: "fail",
        data: {
          reason: "Cannot logout user that is not logged in",
        },
      });
      return;
    }

    req.logout();
    res.status(200).json({
      status: "success",
      data: {
        userId: user.userId,
      },
    });
  }
}

export default UserController;
