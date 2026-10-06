const express = require("express");
const router = express.Router();

const {
    getAvailability,
    setMyAvailability,
    toggleFollow
} = require("../controllers/availabilityController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.get("/", protect, getAvailability);
router.put("/me", protect, authorize("teacher"), setMyAvailability);
router.post("/:teacherId/follow", protect, authorize("student"), toggleFollow);

module.exports = router;
