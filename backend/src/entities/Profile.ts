import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import BaseEntity from "./BaseEntity";
import Photo from "./Photo";

@Entity()
class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  profileId: number;

  @Column({ type: "varchar", length: 31, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  bio: string;

  @Column({ type: "varchar", length: 31, nullable: true })
  phone: number;

  @OneToOne(() => Photo, { nullable: true })
  @JoinColumn()
  photo: Photo;
}

export default Profile;
