import React, { useState } from "react";
import { useProjectsContext } from "../hooks/useProjectsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const ProjectForm = ({ project, setIsModalOpen, setIsOverlayOpen }) => {
  const [title, setTitle] = useState(project ? project.title : "");
  const [tech, setTech] = useState(project ? project.tech : "");
  const [budget, setBudget] = useState(project ? project.budget : "");
  const [duration, setDuration] = useState(project ? project.duration : "");
  const [manager, setManager] = useState(project ? project.manager : "");
  const [dev, setDev] = useState(project ? project.dev : "");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const { dispatch } = useProjectsContext();
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in!");
      return;
    }

    // data
    const projectObj = { title, tech, budget, duration, manager, dev };

    // if there is no project, send post req
    if (!project) {
      // sending post request
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(projectObj),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields);
      }

      // reset
      if (res.ok) {
        setTitle("");
        setTech("");
        setBudget("");
        setDuration("");
        setManager("");
        setDev("");
        setError(null);
        setEmptyFields([]);
        // project post successfully
        dispatch({ type: "CREATE_PROJECT", payload: json });
      }
      return;
    }

    // if there is a project, send patch req
    if (project) {
      // sending patch req
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/projects/${project._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(projectObj),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields);
      }

      if (res.ok) {
        setError(null);
        setEmptyFields([]);

        // dispatch
        dispatch({ type: "UPDATE_PROJECT", payload: json });

        // closing overlay & modal
        setIsModalOpen(false);
        setIsOverlayOpen(false);
      }
      return;
    }
  };

  const inputClass = (field) => `
    w-full px-3 py-2 
    bg-white dark:bg-dark-card
    text-gray-900 dark:text-white
    border ${emptyFields?.includes(field) ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-dark-border'} 
    rounded-md 
    shadow-sm 
    placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none 
    focus:ring-2 
    focus:ring-indigo-500 dark:focus:ring-indigo-400
    focus:border-indigo-500 dark:focus:border-indigo-400
    sm:text-sm
    transition duration-150
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!project && (
        <h3 className="text-xl font-semibold text-gray-900">
          Create New Project
        </h3>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Project Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. E-commerce Website"
              className={inputClass('title')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="tech" className="block text-sm font-medium text-gray-700">
            Technologies
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="tech"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="e.g. React, Node.js, MongoDB"
              className={inputClass('tech')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget (USD)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 5000"
                className={inputClass('budget')}
              />
            </div>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (Weeks)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 12"
                className={inputClass('duration')}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
            Project Manager
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="e.g. John Smith"
              className={inputClass('manager')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="dev" className="block text-sm font-medium text-gray-700">
            Team Size
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="dev"
              value={dev}
              onChange={(e) => setDev(e.target.value)}
              placeholder="e.g. 5"
              className={inputClass('dev')}
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
        >
          {project ? "Update Project" : "Create Project"}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProjectForm;
