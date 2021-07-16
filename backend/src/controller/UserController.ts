import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import User from "../entities/User";

class UserController {
  public async userDetails(req: Request, res: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    const userId = req.params.id;

    try {
      const user = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("profile.photo", "photo")
        .where("user.userId = :id", { id: userId })
        .getOne();

      if (!user) {
        res.status(404).json({
          status: "fail",
          data: {
            reason: "No user with id: " + userId,
          },
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
