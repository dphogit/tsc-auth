import { User } from "../common/interfaces";

export interface Details {
  email: string;
  password: string;
}

interface LoginResponse {
  status: "success" | "fail" | "error";
  data: {
    reason: string;
    name: string;
    message: string;
    stack: string;
    token: string;
    expiresInMs: number;
    userId: number;
  };
}

interface RegisterResponse {
  status: "success" | "fail" | "error";
  data: {
    reason: string;
    name: string;
    message: string;
    stack: string;
    user: User;
  };
}

const BASE_URL = "http://localhost:8080/api/v1/auth";

export async function login(details: Details) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify(details),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json: LoginResponse = await response.json();

  return json;
}

export async function register(details: Details) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    body: JSON.stringify(details),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json: RegisterResponse = await response.json();

  return json;
}
