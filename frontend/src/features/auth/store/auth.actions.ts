import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../../user/types/user.type";
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

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string; user: User } | undefined> => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const resp = await fetch(`${baseUrl}login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: config.headers,
      });
      const data = await resp.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
