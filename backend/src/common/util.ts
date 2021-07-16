import fs from "fs";
import path from "path";

export const clearPhoto = (filename: string): void => {
  const filePath = path.join(__dirname, "..", "..", "public\\photos", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};
