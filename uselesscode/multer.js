// Multer
const multer = require("multer")

// Path Dependency for Flexibility
const path = require("path")

/**
 *
 * @desc   Setting up Multer
 * @utils  Multer helps uploading images to server
 *
 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/../uploads"))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname)
  },
})

// Filter by Allowing Only .JPEG and .PNG Files
const filterOptions = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: filterOptions,
})

// Exporting
module.exports = upload
