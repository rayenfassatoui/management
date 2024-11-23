import React, { useState } from "react";
import moment from "moment";
import { useProjectsContext } from "../hooks/useProjectsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { currencyFormatter } from "../utilities/currencyFormatter";
import ProjectForm from "./ProjectForm";

const ProjectDetails = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { dispatch } = useProjectsContext();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/projects/${project._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await res.json();

    if (res.ok) {
      dispatch({ type: "DELETE_PROJECT", payload: json });
    }
  };

  const handleUpdate = () => {
    setIsModalOpen(true);
    setIsOverlayOpen(true);
  };

  const handleOverlay = () => {
    setIsModalOpen(false);
    setIsOverlayOpen(false);
  };

  return (
    <div 
      className="project bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg 
        hover:shadow-xl transition-all duration-300 border border-gray-100 
        dark:border-gray-800 backdrop-blur-lg backdrop-filter"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-indigo-600 to-purple-600
              dark:from-indigo-400 dark:to-purple-400">
              {project.title}
            </h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {project.tech.split(',').map((tech, index) => (
                <span key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full 
                    text-xs font-medium bg-gray-100 text-gray-800
                    dark:bg-gray-800 dark:text-gray-200">
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 
              dark:from-indigo-500/20 dark:to-purple-500/20 
              text-indigo-700 dark:text-indigo-300 rounded-lg font-medium">
              {currencyFormatter(project.budget)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Created {moment(project.createdAt).fromNow()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br 
          from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 
          rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Duration: {project.duration} weeks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Team Size: {project.dev}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Manager: {project.manager}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {moment(project.createdAt).fromNow()}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleUpdate}
            className="inline-flex items-center px-4 py-2 
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              dark:from-indigo-500 dark:to-purple-500
              dark:hover:from-indigo-600 dark:hover:to-purple-600
              text-white text-sm font-medium rounded-lg 
              transform transition-all duration-200 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-indigo-500 dark:focus:ring-offset-dark-bg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Update
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 
              text-red-600 dark:text-red-400 
              hover:bg-red-50 dark:hover:bg-red-900/30
              rounded-lg
              transform transition-all duration-200 hover:scale-105
              text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 overflow-y-auto ${isModalOpen ? "" : "hidden"}`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
            aria-hidden="true"
            onClick={handleOverlay}
          ></div>

          <div className="inline-block align-bottom bg-white dark:bg-dark-card rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={handleOverlay}
                className="bg-white dark:bg-dark-card rounded-md text-gray-400 dark:text-gray-500 
                  hover:text-gray-500 dark:hover:text-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                  dark:focus:ring-offset-dark-bg"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                Update Project
              </h3>
              <div className="mt-4">
                <ProjectForm
                  project={project}
                  setIsModalOpen={setIsModalOpen}
                  setIsOverlayOpen={setIsOverlayOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProjectDetails);
