import { createAsyncThunk } from "@reduxjs/toolkit";
const baseUrl = import.meta.env.VITE_API_URL;

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const resp = await fetch(`${baseUrl}signup`, {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: config.headers,
      });
      const data = await resp.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
