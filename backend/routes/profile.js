const express = require("express");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../utils/cloudinaryConfig");
const User = require("../models/user");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// ✅ Allow only PDF files
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed!"), false);
};

// ✅ Cloudinary storage setup for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw", // raw for non-image files
    format: "pdf",
    allowed_formats: ["pdf"],
  },
});

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
});

// 🧾 GET user profile
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✏️ UPDATE user profile
router.put("/", verifyToken, async (req, res) => {
  const {
    github,
    linkedin,
    bio,
    avatar,
    motivation,
    skills,
    careerGoals,
    dreamCompany,
    favoriteProject,
    location,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        github,
        linkedin,
        bio,
        avatar,
        motivation,
        skills,
        careerGoals,
        dreamCompany,
        favoriteProject,
        location,
      },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 📤 UPLOAD or UPDATE Resume (PDF)
router.post(
  "/resume-file",
  verifyToken,
  uploadResume.single("file"),
  async (req, res) => {
    try {
      console.log("Received file from frontend:", req.file);

      // If no file received
      if (!req.file || !req.file.path || !req.file.filename) {
        return res.status(400).json({ error: "No PDF file uploaded" });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      // Delete old resume if it exists
      if (user.resume && user.resume.public_id) {
        try {
          await cloudinary.uploader.destroy(user.resume.public_id, {
            resource_type: "raw",
          });
        } catch (err) {
          console.error("Cloudinary resume deletion error:", err.message);
        }
      }

      // Save new resume in MongoDB
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            resume: {
              url: req.file.path,
              public_id: req.file.filename,
            },
          },
        },
        { new: true, runValidators: true }
      );

      console.log("Resume uploaded for:", updatedUser.email);

      res.json({
        message: "Resume uploaded successfully",
        resumeUrl: req.file.path,
      });
    } catch (err) {
      console.error("Resume upload error:", err);
      res.status(500).json({ error: err.message || "Server error" });
    }
  }
);

// ❌ DELETE Resume
router.delete("/resume-file", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.resume || !user.resume.public_id)
      return res.status(404).json({ error: "No resume found" });

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(user.resume.public_id, {
        resource_type: "raw",
      });
    } catch (err) {
      console.error("Cloudinary resume deletion error:", err.message);
    }

    // Remove resume field from MongoDB
    await User.findByIdAndUpdate(req.user.id, { $unset: { resume: 1 } });

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("Resume delete error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Add this after your existing imports
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    transformation: [
      { width: 500, height: 500, crop: "thumb", gravity: "face" },  // <-- FIXED HERE
    ],
    allowed_formats: ["jpg", "jpeg", "png"],
    resource_type: "image",
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post(
  "/avatar",
  verifyToken,
  (req, res, next) => {
    uploadAvatar.single("avatar")(req, res, (err) => {
      if (err) {
        // Catch multer errors here
        return res.status(400).json({
          error: err.message || "File upload failed",
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file || !req.file.path || !req.file.filename) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      // Remove old avatar from Cloudinary if exists and it's not the default
      const user = await User.findById(req.user.id);
      if (user && user.avatar && user.avatar.public_id) {
        try {
          await cloudinary.uploader.destroy(user.avatar.public_id, { resource_type: "image" });
        } catch (err) {
          console.warn("Old avatar not deleted:", err.message || err);
        }
      }

      // Save Cloudinary URL and public_id in MongoDB
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: { url: req.file.path, public_id: req.file.filename } },
        { new: true, runValidators: true }
      ).select("-password -__v");

      return res.json({
        message: "Avatar uploaded successfully",
        avatar: req.file.path,
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({
        error: err && err.message ? err.message : String(err),
        details: typeof err === "object" ? err : undefined,
      });
    }
  }
);

module.exports = router;
