import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../../user/types/user.type";
import { toast } from "sonner";
const baseUrl = import.meta.env.VITE_API_URL;

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ): Promise<
    { user: User; accessToken: string } | ReturnType<typeof rejectWithValue>
  > => {
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
      return rejectWithValue({
        error: error instanceof Error ? error.message : "Unknown error",
      });
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
      if (resp.ok) {
        return data;
      }
      toast.error(data.message);
      return undefined;
    } catch {
      toast.error("Failed to login");
    }
  }
);
