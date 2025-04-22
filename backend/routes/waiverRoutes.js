// backend/routes/waiverRoutes.js
const express = require("express");
const router = express.Router();
const Waiver = require("../models/Waiver");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ─── Public: anyone (even not logged in) can submit ───────────────────────
router.post("/", async (req, res) => {
  try {
    const { waiverType, formData } = req.body;
    if (!waiverType || !formData) {
      return res.status(400).json({ message: "waiverType and formData are required" });
    }
    const waiver = await Waiver.create({ waiverType, formData });
    return res.status(201).json(waiver);
  } catch (err) {
    console.error("Error saving waiver:", err);
    return res.status(500).json({ message: "Error saving waiver" });
  }
});

// ─── Authenticated users can see all waivers ───────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const waivers = await Waiver.find().sort({ dateSigned: -1 });
    return res.json(waivers);
  } catch (err) {
    console.error("Error fetching waivers:", err);
    return res.status(500).json({ message: "Error fetching waivers" });
  }
});

// ─── Admins only can approve ───────────────────────────────────────────────
router.put("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const w = await Waiver.findById(req.params.id);
    if (!w) return res.status(404).json({ message: "Waiver not found" });
    w.status = "approved";
    await w.save();
    return res.json(w);
  } catch (err) {
    console.error("Error approving waiver:", err);
    return res.status(500).json({ message: "Error approving waiver" });
  }
});

// ─── Admins only can reject ────────────────────────────────────────────────
router.put("/:id/reject", protect, adminOnly, async (req, res) => {
  try {
    const w = await Waiver.findById(req.params.id);
    if (!w) return res.status(404).json({ message: "Waiver not found" });
    w.status = "rejected";
    await w.save();
    return res.json(w);
  } catch (err) {
    console.error("Error rejecting waiver:", err);
    return res.status(500).json({ message: "Error rejecting waiver" });
  }
});

module.exports = router;
