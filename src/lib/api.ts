const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

/* =========================================================
   TYPES
========================================================= */

type ApiErrorPayload = {
  code?: string;
  message?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
  message?: string;
};

type ApiFetchOptions = RequestInit & {
  accessToken?: string;
};

/* =========================================================
   API ERROR
========================================================= */

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(
    message: string,
    status: number,
    code = "API_ERROR",
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/* =========================================================
   API FETCH
========================================================= */

async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    accessToken,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const headers = new Headers(
    customHeaders,
  );

  /*
   * JSON content type only when there is a body.
   */
  if (
    fetchOptions.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  /*
   * Access token is supplied by the auth store
   * when a protected API request is made.
   */
  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...fetchOptions,

      headers,

      /*
       * Required for the HTTP-only refresh-token
       * cookie created by the backend.
       */
      credentials: "include",

      cache: "no-store",
    },
  );

  /* =======================================================
     RESPONSE PARSING
  ======================================================= */

  let result:
    | ApiResponse<T>
    | null = null;

  const contentType =
    response.headers.get(
      "content-type",
    );

  if (
    contentType?.includes(
      "application/json",
    )
  ) {
    try {
      result =
        (await response.json()) as ApiResponse<T>;
    } catch {
      result = null;
    }
  }

  /* =======================================================
     ERROR HANDLING
  ======================================================= */

  if (!response.ok) {
    throw new ApiError(
      result?.error?.message ||
        result?.message ||
        "Something went wrong while contacting the API.",
      response.status,
      result?.error?.code ||
        "API_ERROR",
    );
  }

  if (
    !result ||
    result.success !== true
  ) {
    throw new ApiError(
      result?.error?.message ||
        result?.message ||
        "The API returned an invalid response.",
      response.status,
      result?.error?.code ||
        "INVALID_API_RESPONSE",
    );
  }

  /*
   * Some successful endpoints may intentionally return
   * only a message and no data.
   */
  return result.data as T;
}

/* =========================================================
   EXPORTS
========================================================= */

export {
  API_BASE_URL,
  apiFetch,
};

export type {
  ApiResponse,
  ApiFetchOptions,
};