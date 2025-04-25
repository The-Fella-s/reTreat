const fs = require("fs");
const path = require("path");
const docusign = require("docusign-esign");

async function getJwtApiClient() {
  // 1) Read your private key
  const privateKey = fs.readFileSync(
    path.resolve(__dirname, "../", process.env.DOCUSIGN_PRIVATE_KEY_PATH),
    "utf8"
  );

  // 2) Configure the ApiClient for OAuth
  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(process.env.DOCUSIGN_OAUTH_BASE);

  // 3) Request a JWT user token
  const results = await apiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY,         // your Integration Key
    process.env.DOCUSIGN_USER_ID,                 // the user to impersonate
    process.env.DOCUSIGN_SCOPES.split(" "),       // scopes array
    privateKey,                                   // string contents of your PEM
    3600                                          // token lifetime in seconds
  );

  const accessToken = results.body.access_token;
  // 4) Attach the token to the client
  apiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);
  return apiClient;
}

module.exports = { getJwtApiClient };
