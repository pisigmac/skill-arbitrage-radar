import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Radar } from "lucide-react";

function getGitHubOAuthUrl() {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-sm border border-[#1A1A1A]/10 bg-white">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#059669]/10">
              <Radar className="h-5 w-5 text-[#059669]" />
            </div>
          </div>
          <CardTitle className="text-base font-semibold text-[#0F172A]">
            Skill Arbitrage Radar
          </CardTitle>
          <p className="text-xs text-[#1A1A1A]/50">
            Sign in to get personalized arbitrage recommendations
          </p>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-[#0F172A] hover:bg-[#0F172A]/90"
            size="lg"
            onClick={() => {
              window.location.href = getGitHubOAuthUrl();
            }}
          >
            <Github className="h-4 w-4 mr-2" />
            Sign in with GitHub
          </Button>
          <p className="text-[10px] text-[#1A1A1A]/40 text-center mt-3">
            We only access your public profile and email. No repository access.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
