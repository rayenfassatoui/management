const Project = require("../models/projectModel");
const mongoose = require("mongoose");

// GET all projects with timeout
const getAllProjects = async (req, res) => {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database timeout')), 8000)
    );
    
    const projectsPromise = Project.find({ user_id: req.user._id }).sort({
      createdAt: -1,
    });

    const projects = await Promise.race([projectsPromise, timeoutPromise]);
    res.status(200).json(projects);
  } catch (error) {
    if (error.message === 'Database timeout') {
      res.status(504).json({ error: 'Request timed out' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// GET a single project
const getSingleProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid project ID" });
  }

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ error: "No such project exists" });
  }

  res.status(200).json(project);
};

// POST a new project
const postProject = async (req, res) => {
  const { title, tech, budget, duration, manager, dev } = req.body;

  let emptyFields = [];

  if (!title) emptyFields.push("title");
  if (!tech) emptyFields.push("tech");
  if (!budget) emptyFields.push("budget");
  if (!duration) emptyFields.push("duration");
  if (!manager) emptyFields.push("manager");
  if (!dev) emptyFields.push("dev");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const user_id = req.user._id;
    const project = await Project.create({
      title,
      tech,
      budget,
      duration,
      manager,
      dev,
      user_id,
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid project ID" });
  }

  const project = await Project.findOneAndDelete({ _id: id });

  if (!project) {
    return res.status(400).json({ error: "No such project exists" });
  }

  res.status(200).json(project);
};

// UPDATE a project
const updateProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid project ID" });
  }

  const project = await Project.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );

  if (!project) {
    return res.status(400).json({ error: "No such project exists" });
  }

  res.status(200).json(project);
};

module.exports = {
  postProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
  updateProject,
}; 