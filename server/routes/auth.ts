import { RequestHandler } from "express";
import { ApiResponse } from "@shared/api";
import { externalLogin } from "../services/external-api";

console.log("[Auth Module] Loaded");

interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login endpoint
 * Acts as a proxy to the external API
 * Centralizes error handling and response transformation
 */
export const login: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body as LoginRequest;

    console.log("[Auth] Login attempt:", { username });

    if (!username || !password) {
      console.log("[Auth] Missing username or password");
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    // Call external API through centralized service
    const externalResponse = await externalLogin(username, password);

    console.log("[Auth] Login successful:", { username });

    // Return the response from external API
    const response: ApiResponse<any> = {
      success: true,
      data: externalResponse,
    };

    return res.json(response);
  } catch (error) {
    console.error("[Auth] Login error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Login failed";

    res.status(401).json({
      success: false,
      error: errorMessage,
    });
  }
};
