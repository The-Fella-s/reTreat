const express = require('express');
const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const router = express.Router();

async function sendDocument(req, res) {
    try {
        const { name, email } = req.body;

        const apiClient = new docusign.ApiClient();
        apiClient.setBasePath(process.env.DOCUSIGN_BASE_URL);
        apiClient.setOAuthBasePath("account-d.docusign.com");

        const privateKeyPath = path.join(__dirname, '../private.key');
        const results = await apiClient.requestJWTUserToken(
            process.env.DOCUSIGN_CLIENT_ID,
            process.env.DOCUSIGN_ACCOUNT_ID,
            ['signature'],
            fs.readFileSync(privateKeyPath),
            3600
        );

        const accessToken = results.body.access_token;
        apiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);


        const envelopesApi = new docusign.EnvelopesApi(apiClient);
        const envelopeDefinition = new docusign.EnvelopeDefinition();
        envelopeDefinition.emailSubject = "Sign this document";


        const docBytes = fs.readFileSync(path.join(__dirname, '../uploads/contract.pdf'));
        envelopeDefinition.documents = [{
            documentBase64: Buffer.from(docBytes).toString("base64"),
            name: "Contract",
            fileExtension: "pdf",
            documentId: "1"
        }];

        // Add recipient
        envelopeDefinition.recipients = {
            signers: [{
                email,
                name,
                recipientId: "1",
                clientUserId: "1001"
            }]
        };

        envelopeDefinition.status = "sent"; 

  
        const resultsEnv = await envelopesApi.createEnvelope(process.env.DOCUSIGN_ACCOUNT_ID, { envelopeDefinition });

        res.json({ envelopeId: resultsEnv.envelopeId, message: "Document sent for signing!" });
    } catch (error) {
        console.error("DocuSign Error:", error);
        res.status(500).json({ error: "Failed to send document" });
    }
}


router.post('/send-document', sendDocument);

module.exports = router;
