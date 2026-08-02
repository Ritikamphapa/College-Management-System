const express = require("express");
const router = express.Router();

const {
    addMark,
    getAllMarks,
    getStudentMarks,
    updateMark,
    deleteMark
} = require("../controllers/markController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin", "teacher"), addMark);

router.get("/", protect, authorize("admin", "teacher"), getAllMarks);

router.get("/student/:studentId", protect, authorize("admin", "teacher"), getStudentMarks);

router.put("/:id", protect, authorize("admin", "teacher"), updateMark);

router.delete("/:id", protect, authorize("admin", "teacher"), deleteMark);

module.exports = router;