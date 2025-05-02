
const express = require("express");
const router = express.Router();
const docusign = require("docusign-esign");
const Waiver = require("../models/Waiver");
const { getJwtApiClient } = require("../lib/docusign-jwt");

const ACCOUNT_ID        = process.env.DOCUSIGN_ACCOUNT_ID;
const BASE_PATH         = process.env.DOCUSIGN_BASE_URL;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

router.get("/templates", async (req, res) => {
  try {
    const apiClient = await getJwtApiClient();
    apiClient.setBasePath(BASE_PATH || "https://docusign.net/restapi");
    
    const templatesApi = new docusign.TemplatesApi(apiClient);
    
    const result = await templatesApi.listTemplates(ACCOUNT_ID);
    console.log("TemplatesApi.listTemplates result:", result);

    return res.json({
      templates: result.envelopeTemplates || []
    });
  } catch (err) {
    console.error("❌ Error in GET /templates:", err.response?.body || err);
    return res.status(500).json({
      message: "Could not fetch templates",
      detail: err.message
    });
  }
});

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

    const apiClient    = await getJwtApiClient();
    apiClient.setBasePath(BASE_PATH);
    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    const envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
      templateId,
      status: "sent",
      templateRoles: [{
        email: customerEmail,
        name: customerName,
        roleName: "Client",
        clientUserId,
        tabs: tabs || {}
      }]
    });

    const createResult = await envelopesApi.createEnvelope(
      ACCOUNT_ID,
      { envelopeDefinition }
    );
    const envelopeId = createResult.envelopeId;
    await Waiver.findByIdAndUpdate(clientUserId, { envelopeId });

    const returnUrl = `${FRONTEND_BASE_URL}/waiver-complete`;
    const viewReq   = docusign.RecipientViewRequest.constructFromObject({
      returnUrl,
      authenticationMethod: "none",
      email: customerEmail,
      userName: customerName,
      clientUserId,
      recipientId: "1"
    });

    const viewResult = await envelopesApi.createRecipientView(
      ACCOUNT_ID,
      envelopeId,
      { recipientViewRequest: viewReq }
    );

    return res.json({
      signingUrl: viewResult.url,
      envelopeId
    });
  } catch (err) {
    console.error("DocuSign send-envelope error:", err);
    return res.status(500).json({ message: "DocuSign error", error: err.message });
  }
});

router.get("/envelopes/:id/document", async (req, res) => {
  try {
    const waiver = await Waiver.findById(req.params.id);
    if (!waiver?.envelopeId) {
      return res.status(404).end();
    }

    const apiClient    = await getJwtApiClient();
    apiClient.setBasePath(BASE_PATH);
    const envelopesApi = new docusign.EnvelopesApi(apiClient);

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
