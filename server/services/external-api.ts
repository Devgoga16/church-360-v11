/**
 * External API Service
 * Centralized service for all external API calls
 * Acts as a proxy between the client and external APIs
 */

const EXTERNAL_API_BASE_URL =
  process.env.EXTERNAL_API_URL || "https://iglesia360-api.unify-tec.com";

interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
}

/**
 * Make a request to the external API
 */
async function makeRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    token,
  } = options;

  const url = `${EXTERNAL_API_BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  console.log(`[External API] ${method} ${endpoint}`);

  try {
    const response = await fetch(url, fetchOptions);

    console.log(
      `[External API] Response status for ${endpoint}: ${response.status}`,
    );

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}` };
      }
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const data: T = await response.json();
    console.log(`[External API] Success: ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`[External API] Error on ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Login to the external API
 */
export async function externalLogin(
  username: string,
  password: string,
): Promise<any> {
  return makeRequest("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

/**
 * Get user profile from external API
 */
export async function externalGetProfile(token: string): Promise<any> {
  return makeRequest("/api/users/me", {
    method: "GET",
    token,
  });
}

/**
 * Generic method to call external API endpoints
 * Useful for making additional calls to the external API
 */
export async function externalCall<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  return makeRequest<T>(endpoint, options);
}
