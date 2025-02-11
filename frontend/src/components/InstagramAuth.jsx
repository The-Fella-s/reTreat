import { useEffect, useState } from "react";

const InstagramAuth = () => {
  const clientId = import.meta.env.VITE_IG_APP_ID;
  const redirectUri = import.meta.env.VITE_IG_REDIRECT_URI;
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;

  const [authCode, setAuthCode] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setAuthCode(code);
      console.log("Auth Code:", code);
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: import.meta.env.VITE_IG_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code: code,
        }),
      });
      const data = await response.json();
      console.log("Access Token:", data.access_token);
      localStorage.setItem("igAccessToken", data.access_token);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  return (
    <div>
      {!authCode ? (
        <a href={authUrl}>Login with Instagram</a>
      ) : (
        <p>Authenticated! Getting Instagram Feed...</p>
      )}
    </div>
  );
};

export default InstagramAuth;
