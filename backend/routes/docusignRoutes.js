// backend/routes/docusignRoutes.js
const express = require("express");
const router = express.Router();
const docusign = require("docusign-esign");
const Waiver = require("../models/Waiver");
const { getJwtApiClient } = require("../lib/docusign-jwt");

const ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;
const BASE_PATH  = process.env.DOCUSIGN_BASE_URL;      // e.g. https://demo.docusign.net/restapi
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL; // e.g. http://localhost:5173

// ─── Send Envelope & Generate Embedded Signing URL ─────────────────────────
router.post("/send-envelope", async (req, res) => {
  try {
    const { customerEmail, customerName, clientUserId } = req.body;

    // 1) Initialize JWT‐authenticated DocuSign API client
    const apiClient = await getJwtApiClient();
    apiClient.setBasePath(BASE_PATH);
    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    // 2) Build envelope definition
    const envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = "Please sign your waiver";
    envDef.status       = "sent";
    envDef.documents    = [
      {
        documentBase64: Buffer.from(
          `Hello ${customerName}, please sign this waiver.`
        ).toString("base64"),
        name:          "Waiver",
        fileExtension: "txt",
        documentId:    "1",
      },
    ];

    // 3) Add a signer with clientUserId for embedded signing
    const signer = docusign.Signer.constructFromObject({
      email:        customerEmail,
      name:         customerName,
      recipientId:  "1",
      routingOrder: "1",
      clientUserId,
    });
    signer.tabs = docusign.Tabs.constructFromObject({
      signHereTabs: [
        {
          documentId:  "1",
          pageNumber:  "1",
          recipientId: "1",
          xPosition:   "100",
          yPosition:   "150",
        },
      ],
    });
    envDef.recipients = docusign.Recipients.constructFromObject({
      signers: [signer],
    });

    // 4) Create the envelope
    const createResult = await envelopesApi.createEnvelope(ACCOUNT_ID, {
      envelopeDefinition: envDef,
    });
    const envelopeId = createResult.envelopeId;

    // 5) Persist envelopeId on your Waiver record
    await Waiver.findByIdAndUpdate(clientUserId, { envelopeId });

    // 6) Create the embedded signing view
    const returnUrl = `${FRONTEND_BASE_URL}/waiver-complete`;
    const viewReq = docusign.RecipientViewRequest.constructFromObject({
      returnUrl,
      authenticationMethod: "none",
      email:        customerEmail,
      userName:     customerName,
      recipientId:  "1",
      clientUserId,
    });
    const viewResult = await envelopesApi.createRecipientView(
      ACCOUNT_ID,
      envelopeId,
      { recipientViewRequest: viewReq }
    );

    // 7) Return the signing URL and envelopeId
    res.json({ signingUrl: viewResult.url, envelopeId });
  } catch (err) {
    console.error("DocuSign send-envelope error:", err);
    res.status(500).json({ message: "DocuSign error", error: err });
  }
});

// ─── Download Completed PDF ────────────────────────────────────────────────
router.get("/envelopes/:id/document", async (req, res) => {
  try {
    const waiver = await Waiver.findById(req.params.id);
    if (!waiver?.envelopeId) return res.status(404).end();

    const apiClient = await getJwtApiClient();
    apiClient.setBasePath(BASE_PATH);
    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    // “combined” yields the fully-signed PDF
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
