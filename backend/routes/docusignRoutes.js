// backend/routes/docusignRoutes.js
const express = require("express");
const router = express.Router();
const docusign = require("docusign-esign");
const Waiver = require("../models/Waiver");
const { getJwtApiClient } = require("../lib/docusign-jwt");

const ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;
const BASE_PATH = process.env.DOCUSIGN_BASE_URL;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

// Send envelope using a template and prefilled fields
router.post("/send-envelope", async (req, res) => {
  try {
    const { 
      customerEmail, 
      customerName, 
      clientUserId, 
      templateId, 
      tabs 
    } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    // Initialize JWT-authenticated DocuSign API client
    const apiClient = await getJwtApiClient();
    apiClient.setBasePath(BASE_PATH);
    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    // Create the envelope definition with template
    const envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
      templateId: templateId,
      status: "sent",
      templateRoles: [{
        email: customerEmail,
        name: customerName,
        roleName: "Client", // Must match recipient role in your template
        clientUserId: clientUserId, // Required for embedded signing
        tabs: tabs || {}
      }]
    });

    // Create the envelope
    const createResult = await envelopesApi.createEnvelope(ACCOUNT_ID, {
      envelopeDefinition: envelopeDefinition,
    });
    const envelopeId = createResult.envelopeId;

    // Update the waiver with envelope ID
    await Waiver.findByIdAndUpdate(clientUserId, { envelopeId });

    // Create the embedded signing view
    const returnUrl = `${FRONTEND_BASE_URL}/waiver-complete`;
    const viewReq = docusign.RecipientViewRequest.constructFromObject({
      returnUrl,
      authenticationMethod: "none", 
      email: customerEmail,
      userName: customerName,
      clientUserId: clientUserId,
      recipientId: "1"
    });
    
    const viewResult = await envelopesApi.createRecipientView(
      ACCOUNT_ID,
      envelopeId,
      { recipientViewRequest: viewReq }
    );

    // Return the signing URL and envelopeId
    res.json({ signingUrl: viewResult.url, envelopeId });
  } catch (err) {
    console.error("DocuSign send-envelope error:", err);
    res.status(500).json({ message: "DocuSign error", error: err.message });
  }
});

// Download Completed PDF 
router.get("/envelopes/:id/document", async (req, res) => {
  try {
    const waiver = await Waiver.findById(req.params.id);
    if (!waiver?.envelopeId) return res.status(404).end();

    const apiClient = await getJwtApiClient();
    apiClient.setBasePath(BASE_PATH);
    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    // "combined" yields the fully-signed PDF
    const pdfBytes = await envelopesApi.getDocument(
      ACCOUNT_ID,
      waiver.envelopeId,
      "combined"
    );

    res
      .contentType("application/pdf")
      .header(
        "Content-Disposition",
        `inline; filename=waiver-${waiver._id}.pdf`
      )
      .send(Buffer.from(pdfBytes, "binary"));
  } catch (err) {
    console.error("DocuSign getDocument error:", err);
    res.status(500).end();
  }
});

module.exports = router;