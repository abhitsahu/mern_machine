
const express = require("express");
const { uploadCSV, getUploads } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/csv", authMiddleware, uploadCSV);
router.get("/getUpload", authMiddleware, getUploads);

module.exports = router;
