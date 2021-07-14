import { CreateDateColumn, UpdateDateColumn } from "typeorm";

abstract class BaseEntity {
  @CreateDateColumn({ type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: string;
}

export default BaseEntity;
