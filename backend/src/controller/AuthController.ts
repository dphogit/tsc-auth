import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import passport from "passport";

import User from "../entities/User";

class UserController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

  public authenticate(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          status: "fail",
          data: {
            reason: "Unauthorized",
          },
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
      });

      res.status(200).json({
        status: "success",
        data: {
          userId: user.userId,
        },
      });
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
