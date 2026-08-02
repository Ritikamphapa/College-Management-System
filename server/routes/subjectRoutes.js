const express = require("express");
const router = express.Router();

const {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
    assignTeacher
} = require("../controllers/subjectController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

// Admin Routes
router.post("/", protect, authorize("admin"), createSubject);
router.get("/", protect, authorize("admin"), getAllSubjects);
router.get("/:id", protect, authorize("admin"), getSubjectById);
router.put("/:id", protect, authorize("admin"), updateSubject);
router.put(
    "/:id/assign-teacher",
    protect,
    authorize("admin"),
    assignTeacher
);
router.delete("/:id", protect, authorize("admin"), deleteSubject);

module.exports = router;