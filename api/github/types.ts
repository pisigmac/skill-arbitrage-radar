export type GitHubTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
};

export type GitHubUser = {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
};

export type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

export type SessionPayload = {
  githubId: number;
  login: string;
};
