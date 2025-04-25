const express      = require("express");
const router       = express.Router();
const Waiver       = require("../models/Waiver");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");

// ─── Anyone can submit, but if logged in, we capture their user ID ───────────
router.post("/", optionalAuth, async (req, res) => {
  const { waiverType, formData } = req.body;
  if (!waiverType || !formData) {
    return res.status(400).json({ message: "waiverType and formData are required" });
  }

  const newWaiver = {
    waiverType,
    formData
  };
  if (req.user) newWaiver.user = req.user.id;

  try {
    const waiver = await Waiver.create(newWaiver);
    res.status(201).json(waiver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving waiver" });
  }
});

// ─── Guests or users fetch all waivers (admin only) ──────────────────────────
router.get("/", protect, async (req, res) => {
  const waivers = await Waiver.find().sort({ dateSigned: -1 });
  res.json(waivers);
});

// ─── Fetch _only_ this user’s waivers ────────────────────────────────────────
router.get("/my", protect, async (req, res) => {
  try {
    const waivers = await Waiver
      .find({ user: req.user.id })
      .sort({ dateSigned: -1 });
    res.json(waivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching your waivers" });
  }
});

// ─── Admin approve ───────────────────────────────────────────────────────────
router.put("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const waiver = await Waiver.findById(req.params.id);
    if (!waiver) return res.status(404).json({ message: "Waiver not found" });

    waiver.status = "approved";
    await waiver.save();

    res.json(waiver);                                // ← SEND RESPONSE
  } catch (err) {
    console.error("Error approving waiver:", err);
    res.status(500).json({ message: "Error approving waiver" });
  }
});

// ─── Admin reject ────────────────────────────────────────────────────────────
router.put("/:id/reject", protect, adminOnly, async (req, res) => {
  try {
    const waiver = await Waiver.findById(req.params.id);
    if (!waiver) return res.status(404).json({ message: "Waiver not found" });

    waiver.status = "rejected";
    await waiver.save();

    res.json(waiver);                                // ← SEND RESPONSE
  } catch (err) {
    console.error("Error rejecting waiver:", err);
    res.status(500).json({ message: "Error rejecting waiver" });
  }
});


module.exports = router;
