const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const Upload = require("../models/Upload");
const Agent = require("../models/Agent");

// Ensure 'uploads' folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer Upload Middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /csv|xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("Only CSV, XLSX, and XLS files are allowed"));
    }
  },
}).single("file");

// Upload and Distribute CSV Data
exports.uploadCSV = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      if (!data.length) {
        return res.status(400).json({ message: "Empty CSV file or invalid format" });
      }

      // Validate required fields
      const isValid = data.every(item => item.FirstName && item.Phone && item.Notes);
      if (!isValid) {
        return res.status(400).json({ message: "CSV must contain FirstName, Phone, and Notes columns" });
      }

      // Fetch exactly 5 agents
      const agents = await Agent.find();
      if (agents.length < 5) {
        return res.status(400).json({ message: "At least 5 agents required for distribution" });
      }

      // Distribute tasks equally among agents
      const distributedData = data.map((item, index) => ({
        firstName: item.FirstName,
        phone: item.Phone,
        notes: item.Notes,
        agentId: agents[index % 5]._id, // Round-robin distribution among 5 agents
      }));

      // Save distributed data
      await Upload.insertMany(distributedData);

      res.status(200).json({ message: "File uploaded and tasks distributed successfully" });
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({ message: "Error processing file" });
    }
  });
};

// Fetch distributed data with agent details
exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find().populate("agentId", "name email");
    res.status(200).json({ uploads });
  } catch (error) {
    res.status(500).json({ message: "Error fetching uploaded data" });
  }
};
