import { User } from "../common/interfaces";

const BASE_URL = "http://localhost:8080/api/v1/user";

interface FetchUserResponse {
  status: "success" | "fail" | "error";
  data: {
    user: User;
    reason: string;
    name: string;
    message: string;
    stack: string;
  };
}

export async function fetchUserDetails(id: number, token: string) {
  console.log(id, token);
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json: FetchUserResponse = await response.json();

  return json;
}
