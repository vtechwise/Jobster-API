const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType !== "all") {
    queryObject.jobType = jobType;
  }
  let result = Job.find(queryObject).sort("createdAt");
  if (sort === "latest") {
    result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result.sort("createdAt");
  }
  if (sort === "a-z") {
    result.sort("position");
  }
  if (sort === "z-a") {
    result.sort("-position");
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const jobs = await result.skip(skip).limit(limit);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  console.log(userId, jobId);

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with this id: ${jobId}`);
  }

  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
  const userId = req.user.userId;
  req.body.createdBy = userId;
  console.log(userId, req.body);

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide company and postion value");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runvalidator: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with this id ${jobId}`);
  }
  res.status(StatusCodes.OK).json(job);
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  res.status(StatusCodes.OK).json({ message: "Job deleted" });
  res.send("delete job");
};

module.exports = {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  getJob,
};
