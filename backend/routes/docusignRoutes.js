const express = require('express');
const router = express.Router();
const axios = require('axios');
const docusign = require('docusign-esign');

const {
  DOCUSIGN_CLIENT_ID,
  DOCUSIGN_CLIENT_SECRET,
  DOCUSIGN_REDIRECT_URI,
  DOCUSIGN_ACCOUNT_ID,
} = process.env;


router.get('/auth-url', (req, res) => {
  const redirectUrl = `https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature&client_id=${DOCUSIGN_CLIENT_ID}&redirect_uri=${encodeURIComponent(DOCUSIGN_REDIRECT_URI)}`;
  res.json({ url: redirectUrl });
});


router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const response = await axios.post('https://account-d.docusign.com/oauth/token', new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: DOCUSIGN_CLIENT_ID,
      client_secret: DOCUSIGN_CLIENT_SECRET,
      redirect_uri: DOCUSIGN_REDIRECT_URI
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });


    const { access_token } = response.data;

    res.json({ accessToken: access_token, message: 'You can now send documents' });
  } catch (error) {
    res.status(500).json({ message: 'Token exchange failed', error });
  }
});


router.post('/send-envelope', async (req, res) => {
  const { accessToken, customerEmail, customerName } = req.body;

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath("https://demo.docusign.net/restapi");
  apiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);

  const envelopeDefinition = new docusign.EnvelopeDefinition();
  envelopeDefinition.emailSubject = "Please sign your purchase agreement";
  envelopeDefinition.status = "sent";

  const docBase64 = Buffer.from("Hello {{customerName}}, please sign here.").toString('base64');

  envelopeDefinition.documents = [
    {
      documentBase64: docBase64,
      name: "Purchase Agreement",
      fileExtension: "txt",
      documentId: "1",
    }
  ];

  const signer = {
    email: customerEmail,
    name: customerName,
    recipientId: "1",
    routingOrder: "1",
    tabs: {
      signHereTabs: [
        {
          documentId: "1",
          pageNumber: "1",
          recipientId: "1",
          xPosition: "100",
          yPosition: "150",
        }
      ]
    }
  };

  envelopeDefinition.recipients = { signers: [signer] };

  try {
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const result = await envelopesApi.createEnvelope(DOCUSIGN_ACCOUNT_ID, { envelopeDefinition });
    res.json({ message: "Envelope sent!", envelopeId: result.envelopeId });
  } catch (err) {
    console.error("Error sending envelope", err);
    res.status(500).json({ message: "Failed to send document" });
  }
});

module.exports = router;