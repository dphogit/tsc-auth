import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "./BaseEntity";

@Entity()
class Photo extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  photoId: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  filename: string;
}

export default Photo;
