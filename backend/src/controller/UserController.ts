import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";

import User from "../entities/User";
import Profile from "../entities/Profile";
import Photo from "../entities/Photo";
import { clearPhoto } from "../common/util";

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

  public async editProfile(req: Request, res: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    const profileRepository = getRepository(Profile);
    const photoRepository = getRepository(Photo);

    const { password, name, bio, phone } = req.body;
    const photoFile = req.file;

    try {
      const userRequesting = (await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("profile.photo", "photo")
        .where("user.userId = :id", { id: (req.user as User).userId })
        .getOne()) as User;

      // Check that the user sending request has the same id with the one that is wanting to be changed.
      if (userRequesting.userId !== parseInt(req.params.id)) {
        if (photoFile) {
          clearPhoto(photoFile.filename);
        }
        res.status(401).json({
          status: "fail",
          data: { user: "Unauthorized! Not your account!" },
        });
        return;
      }

      userRequesting.password = await bcrypt.hash(password, 12);

      let newProfile;
      if (!userRequesting.profile) {
        // If a user does not have a profile, create a new user profile.
        newProfile = new Profile();
        newProfile.name = name;
        newProfile.bio = bio;
        newProfile.phone = phone;
        userRequesting.profile = newProfile;
      } else {
        // Otherwise update the existing user profile
        newProfile = userRequesting.profile;
        newProfile.name = name;
        newProfile.bio = bio;
        newProfile.phone = phone;
      }

      // Check for a photo file sent in request
      if (photoFile) {
        let newFileName = photoFile.path.split("photos\\")[1];
        const userProfile = userRequesting.profile;

        let newPhoto;

        // If a user doesn't have a photo, then create a new one for the user
        if (!userProfile.photo) {
          newPhoto = new Photo();
          newPhoto.filename = newFileName;
          userProfile!.photo = newPhoto;
        } else {
          // Otherwise remove existing from file system and update to newer
          clearPhoto(userProfile.photo.filename);
          newPhoto = userProfile.photo;
          newPhoto.filename = newFileName;
          userProfile!.photo = newPhoto;
        }

        await photoRepository.save(newPhoto);
      }

      await profileRepository.save(newProfile);
      await userRepository.save(userRequesting);

      console.log(`User with id: ${userRequesting.userId} profile updated`);
      res.status(200).json({
        status: "success",
        data: { user: userRequesting },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
