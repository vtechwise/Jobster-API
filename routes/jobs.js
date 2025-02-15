const express = require("express");
const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  getJob,
} = require("../controllers/jobs");
const testUser = require("../middleware/testUser");
const router = express.Router();

router.route("/").get(getAllJobs).post(testUser, createJob);
router
  .route("/:id")
  .patch(testUser, updateJob)
  .delete(testUser, deleteJob)
  .get(getJob);

module.exports = router;
