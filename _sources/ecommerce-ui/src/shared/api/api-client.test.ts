import { apiRequest } from "./api-client";
import { registerSessionBridge } from "../auth/session-bridge";

describe("apiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    registerSessionBridge(null);
  });

  it("parses successful plain text responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Auth service is up", {
          status: 200,
          headers: { "content-type": "text/plain" }
        })
      )
    );

    await expect(apiRequest<string>("/api/auth/status")).resolves.toBe("Auth service is up");
  });

  it("adds bearer token for protected requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ username: "user" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("/api/users/me", { token: "token-value" });

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect((request.headers as Headers).get("Authorization")).toBe("Bearer token-value");
  });

  it("normalizes validation error details", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: "Input validation failed",
            details: { email: "Email should be valid" }
          }),
          {
            status: 400,
            headers: { "content-type": "application/json" }
          }
        )
      )
    );

    await expect(apiRequest("/api/auth/register")).rejects.toMatchObject({
      status: 400,
      message: "Input validation failed",
      details: { email: "Email should be valid" }
    });
  });

  it("normalizes network errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(apiRequest("/api/auth/status")).rejects.toMatchObject({
      status: 0,
      isNetworkError: true
    });
  });

  it("refreshes once and retries an authenticated request after 401", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Expired access token" }), {
          status: 401,
          headers: { "content-type": "application/json" }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ username: "admin" }), {
          status: 200,
          headers: { "content-type": "application/json" }
        })
      );

    vi.stubGlobal("fetch", fetchMock);
    registerSessionBridge({
      refreshSession: vi.fn().mockResolvedValue({ accessToken: "new-token" }),
      onSessionExpired: vi.fn()
    });

    await expect(apiRequest<{ username: string }>("/api/users/me", { token: "old-token" })).resolves.toEqual({
      username: "admin"
    });

    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toBeInstanceOf(Headers);
    expect(((fetchMock.mock.calls[0][1] as RequestInit).headers as Headers).get("Authorization")).toBe("Bearer old-token");
    expect(((fetchMock.mock.calls[1][1] as RequestInit).headers as Headers).get("Authorization")).toBe("Bearer new-token");
  });

  it("signals session expiry when refresh fails", async () => {
    const onSessionExpired = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Expired access token" }), {
          status: 401,
          headers: { "content-type": "application/json" }
        })
      )
    );
    registerSessionBridge({
      refreshSession: vi.fn().mockRejectedValue(new Error("refresh failed")),
      onSessionExpired
    });

    await expect(apiRequest("/api/users/me", { token: "old-token" })).rejects.toMatchObject({ status: 401 });
    expect(onSessionExpired).toHaveBeenCalled();
  });
});
