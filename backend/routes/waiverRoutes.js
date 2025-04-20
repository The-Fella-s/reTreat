// backend/routes/waiverRoutes.js
const express = require("express");
const router = express.Router();
const Waiver = require("../models/Waiver");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public submit
router.post("/", async (req, res) => {
  try {
    const { waiverType, formData } = req.body;
    if (!waiverType || !formData) {
      return res.status(400).json({ message: "waiverType and formData are required" });
    }
    const waiver = await Waiver.create({ waiverType, formData });
    return res.status(201).json(waiver);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error saving waiver" });
  }
});

// Admin only: list, approve, reject
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const waivers = await Waiver.find().sort({ dateSigned: -1 });
    res.json(waivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching waivers" });
  }
});

router.put("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const w = await Waiver.findById(req.params.id);
    if (!w) return res.status(404).json({ message: "Waiver not found" });
    w.status = "approved";
    await w.save();
    res.json(w);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving waiver" });
  }
});

router.put("/:id/reject", protect, adminOnly, async (req, res) => {
  try {
    const w = await Waiver.findById(req.params.id);
    if (!w) return res.status(404).json({ message: "Waiver not found" });
    w.status = "rejected";
    await w.save();
    res.json(w);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting waiver" });
  }
});

module.exports = router;
