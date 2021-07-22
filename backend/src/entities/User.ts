import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  getRepository,
} from "typeorm";

import BaseEntity from "./BaseEntity";
import Profile from "./Profile";

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  userId: number;

  @Column({ type: "varchar", length: 63, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @OneToOne(() => Profile, { nullable: true })
  @JoinColumn()
  profile: Profile;

  static getUserDetailsById(id: number) {
    return getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("profile.photo", "photo")
      .where("user.userId = :id", { id })
      .getOne();
  }

  static getAllUsers() {
    return getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("profile.photo", "photo")
      .getMany();
  }
}

export default User;
