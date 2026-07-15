import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import * as cookie from "cookie";
import { env } from "../lib/env";
import { getSessionCookieOptions } from "../lib/cookies";
import { Session } from "@contracts/constants";
import { signSessionToken, verifySessionToken } from "./session";
import { findUserByGithubId, upsertUser } from "../queries/users";
import type { GitHubTokenResponse, GitHubUser, GitHubEmail } from "./types";

// ── Exchange OAuth code for access token ──
async function exchangeCode(code: string): Promise<GitHubTokenResponse> {
  const resp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.githubClientId,
      client_secret: env.githubClientSecret,
      code,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Token exchange failed (${resp.status}): ${text}`);
  }

  return resp.json() as Promise<GitHubTokenResponse>;
}

// ── Fetch GitHub user profile ──
async function fetchGitHubUser(token: string): Promise<GitHubUser> {
  const resp = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to fetch user (${resp.status}): ${text}`);
  }

  return resp.json() as Promise<GitHubUser>;
}

// ── Fetch GitHub user emails ──
async function fetchGitHubEmails(token: string): Promise<GitHubEmail[]> {
  const resp = await fetch("https://api.github.com/user/emails", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!resp.ok) return [];
  return resp.json() as Promise<GitHubEmail[]>;
}

// ── Build GitHub OAuth authorize URL ──
export function getGitHubAuthorizeUrl(redirectUri: string, state: string): string {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", env.githubClientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);
  return url.toString();
}

// ── Authenticate incoming request ──
export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) throw new Error("No session cookie");

  const claim = await verifySessionToken(token);
  if (!claim) throw new Error("Invalid session token");

  const user = await findUserByGithubId(claim.githubId);
  if (!user) throw new Error("User not found");

  return user;
}

// ── Hono handler for OAuth callback ──
export function createOAuthCallbackHandler() {
  return async (c: Context) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");
    const errorDescription = c.req.query("error_description");

    if (error) {
      return c.json({ error, error_description: errorDescription }, 400);
    }

    if (!code) {
      return c.json({ error: "Authorization code required" }, 400);
    }

    try {
      const redirectUri = state ? atob(state) : `${new URL(c.req.url).origin}/api/oauth/callback`;

      const tokenResp = await exchangeCode(code);
      if (!tokenResp.access_token) {
        return c.json({ error: "Failed to obtain access token" }, 400);
      }

      const githubUser = await fetchGitHubUser(tokenResp.access_token);

      let email = githubUser.email;
      if (!email) {
        const emails = await fetchGitHubEmails(tokenResp.access_token);
        const primary = emails.find((e) => e.primary && e.verified);
        if (primary) email = primary.email;
      }

      await upsertUser({
        unionId: String(githubUser.id),
        name: githubUser.name || githubUser.login,
        email: email || `${githubUser.login}@users.noreply.github.com`,
        avatar: githubUser.avatar_url,
        lastSignInAt: new Date(),
      });

      const sessionToken = await signSessionToken({
        githubId: githubUser.id,
        login: githubUser.login,
      });

      const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
      setCookie(c, Session.cookieName, sessionToken, {
        ...cookieOpts,
        maxAge: Session.maxAgeMs / 1000,
      });

      return c.redirect("/", 302);
    } catch (err: any) {
      console.error("[GitHub OAuth] Callback failed:", err);
      return c.json({ error: "OAuth callback failed", message: err.message }, 500);
    }
  };
}
