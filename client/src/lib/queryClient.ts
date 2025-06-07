import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Session management for Vercel serverless functions
let sessionId: string | null = localStorage.getItem('sessionId');

export function setSessionId(id: string) {
  sessionId = id;
  localStorage.setItem('sessionId', id);
}

export function clearSessionId() {
  sessionId = null;
  localStorage.removeItem('sessionId');
}

export function getSessionId() {
  return sessionId;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function getHeaders(includeContentType = false) {
  const headers: Record<string, string> = {};
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }
  return headers;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: getHeaders(!!data),
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  // Check for new session ID in response headers
  const newSessionId = res.headers.get('x-session-id');
  if (newSessionId) {
    setSessionId(newSessionId);
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      headers: getHeaders(),
      credentials: "include",
    });

    // Check for new session ID in response headers
    const newSessionId = res.headers.get('x-session-id');
    if (newSessionId) {
      setSessionId(newSessionId);
    }

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
