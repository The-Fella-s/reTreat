const express = require('express');
const router = express.Router();
const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const CLIENT_ID = process.env.DOCUSIGN_CLIENT_ID;
const CLIENT_SECRET = process.env.DOCUSIGN_CLIENT_SECRET;
const REDIRECT_URI = process.env.DOCUSIGN_REDIRECT_URI;
const BASE_URL = process.env.DOCUSIGN_BASE_URL;
const ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;

// Initialize DocuSign API client
const initDsClient = () => {
  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(BASE_URL);
  return dsApiClient;
};
const getAuthenticatedClient = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.docusignAccessToken) {
      throw new Error('User not authenticated with DocuSign');
    }

    if (user.docusignExpiresIn && user.docusignExpiresIn < Date.now()) {
      const dsApiClient = initDsClient();
      const response = await dsApiClient.refreshAccessToken(
        CLIENT_ID,
        CLIENT_SECRET,
        user.docusignRefreshToken
      );

      await User.findByIdAndUpdate(userId, {
        docusignAccessToken: response.accessToken,
        docusignRefreshToken: response.refreshToken,
        docusignExpiresIn: Date.now() + (response.expiresIn * 1000)
      });

      user.docusignAccessToken = response.accessToken;
    }

    const dsApiClient = initDsClient();
    dsApiClient.addDefaultHeader('Authorization', `Bearer ${user.docusignAccessToken}`);
    
    return { dsApiClient, accountId: ACCOUNT_ID };
  } catch (error) {
    console.error('Error getting authenticated client:', error);
    throw error;
  }
};

// Generate authorization URL
router.get('/auth', (req, res) => {
  try {
    const dsApiClient = initDsClient();
    const scopes = ['signature', 'impersonation'];
    const authUri = dsApiClient.getAuthorizationUri(
      CLIENT_ID,
      scopes,
      REDIRECT_URI,
      'code'
    );
    res.status(200).json({ authUrl: authUri });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
});


router.get('/test', (req, res) => {
  res.status(200).json({ 
    message: 'DocuSign route is working!',
    timestamp: new Date().toISOString()
  });
});

// Handle OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is missing' });
    }

    const dsApiClient = initDsClient();
    const response = await dsApiClient.generateAccessToken(
      CLIENT_ID,
      CLIENT_SECRET,
      code
    );

    res.status(200).json({ 
      success: true, 
      message: 'DocuSign authentication successful' 
    });
  } catch (error) {
    console.error('DocuSign callback error:', error);
    res.status(500).json({ error: 'Failed to process DocuSign authentication' });
  }
});

// Create a new envelope with documents (EMAIL ONLY)
router.post('/create-envelope', protect, async (req, res) => {
  try {
    const { documentPath, signerEmail, signerName, documentName, emailSubject, emailBody } = req.body;
    
    if (!documentPath || !signerEmail || !signerName || !documentName) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const { dsApiClient, accountId } = await getAuthenticatedClient(req.user._id);
    const envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = emailSubject || 'Please sign this document';
    
    const doc = new docusign.Document();
    const documentBuffer = fs.readFileSync(path.resolve(documentPath));
    const documentBase64 = Buffer.from(documentBuffer).toString('base64');
    
    doc.documentBase64 = documentBase64;
    doc.name = documentName;
    doc.fileExtension = path.extname(documentPath).substring(1);
    doc.documentId = '1';
    
    envDef.documents = [doc];
    const signer = new docusign.Signer();
    signer.email = signerEmail;
    signer.name = signerName;
    signer.recipientId = '1';
    

    const signHere = new docusign.SignHere();
    signHere.documentId = '1';
    signHere.pageNumber = '1';
    signHere.xPosition = '200';
    signHere.yPosition = '200';
    
    const tabs = new docusign.Tabs();
    tabs.signHereTabs = [signHere];
    signer.tabs = tabs;
    
    const recipients = new docusign.Recipients();
    recipients.signers = [signer];
    envDef.recipients = recipients;
    
    // Set status to "sent" to immediately send the envelope via email
    envDef.status = 'sent';
    
    // Create envelope via API
    const envelopesApi = new docusign.EnvelopesApi(dsApiClient);
    const results = await envelopesApi.createEnvelope(accountId, { envelopeDefinition: envDef });
    
    res.status(200).json({
      envelopeId: results.envelopeId,
      status: results.status,
      message: 'Document sent via email successfully'
    });
  } catch (error) {
    console.error('Error creating envelope:', error);
    res.status(500).json({ error: 'Failed to create envelope' });
  }
});

// Get envelope status
router.get('/envelopes/:envelopeId', protect, async (req, res) => {
  try {
    const { envelopeId } = req.params;
    const { dsApiClient, accountId } = await getAuthenticatedClient(req.user._id);
    const envelopesApi = new docusign.EnvelopesApi(dsApiClient);
    const result = await envelopesApi.getEnvelope(accountId, envelopeId);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting envelope status:', error);
    res.status(500).json({ error: 'Failed to get envelope status' });
  }
});

module.exports = router;