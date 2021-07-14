import { Request, Response } from "express";
import { getRepository } from "typeorm";

import User from "../entities/User";
import bcrypt from "bcrypt";

class UserController {
  public async registerUser(req: Request, res: Response): Promise<void> {
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
}

export default UserController;
