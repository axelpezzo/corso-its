import { cookies } from "next/headers";

// getCharacters
export const getCharacters = async () => {
  const sessionId = (await cookies()).get("sessionId")?.value;

  const response = await fetch(`${process.env.API_BACKEND_URL}/character`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.API_BACKEND_TOKEN,
      Cookie: `sessionId=${sessionId}`,
    },
    credentials: "include",
    next: {
      tags: ["characters"],
    },
  });

  return response.json();
};

// getAttributes
export const getAttributes = async () => {
  const sessionId = (await cookies()).get("sessionId")?.value;

  const response = await fetch(`${process.env.API_BACKEND_URL}/attribute`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.API_BACKEND_TOKEN,
      Cookie: `sessionId=${sessionId}`,
    },
    credentials: "include",
    next: {
      tags: ["attributes"],
    },
  });

  return response.json();
};


// getSkills
export const getSkills = async () => {
  const sessionId = (await cookies()).get("sessionId")?.value;

  const response = await fetch(`${process.env.API_BACKEND_URL}/skill`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.API_BACKEND_TOKEN,
      Cookie: `sessionId=${sessionId}`,
    },
    credentials: "include",
    next: {
      tags: ["skills"],
    },
  });

  return response.json();
};