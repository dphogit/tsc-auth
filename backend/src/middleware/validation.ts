import { body } from "express-validator";

export const validateRegister = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email is not of email valid type"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters"),
];

export const validateEditprofile = [
  body("name")
    .matches(/^[a-zA-Z-'. ]+$/)
    .withMessage("Name contains invalid characters"),
  body("bio")
    .isLength({ max: 255 })
    .withMessage("Bio must be 255 characters or less"),
  body("phone")
    .matches(/^[a-zA-Z0-9+ ]+$/)
    .withMessage("Invalid phone number"),
];
