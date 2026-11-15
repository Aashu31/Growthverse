import React from "react";
import { useParams, Link } from "react-router-dom";
import { PORTFOLIO_DATA } from "../../data";

export default function ProjectDetails() {
  const { slug } = useParams();
  const project = PORTFOLIO_DATA.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
        <div className="text-center">
          <h1 className="text-h2 text-primary-text dark:text-white mb-4">Project Not Found</h1>
          <p className="text-secondary-text dark:text-gray-400 mb-6">
            The project you're looking for doesn't exist.
          </p>
          <Link to="/portfolio" className="btn-primary">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <section className="relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-96 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <div className="container-premium relative z-10">
            <span className="text-blue-400 font-medium uppercase tracking-wider text-sm mb-3 block">
              {project.category}
            </span>
            <h1 className="text-h2 mb-6">{project.title}</h1>
            <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
              {project.description}
            </p>
            <div className="flex gap-4 mt-8">
              <Link to={project.liveUrl} className="btn-primary">
                View Live Project
              </Link>
              <Link to="/portfolio" className="btn-secondary">
                Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-gray-50 dark:bg-dark-secondary rounded-3xl p-8 border border-border dark:border-gray-700">
                <h2 className="text-h3 mb-6">Project Overview</h2>
                <p className="text-secondary-text dark:text-gray-300 leading-relaxed mb-6">
                  {project.description}
                </p>
                <h3 className="font-semibold text-primary-text dark:text-white mb-4">Objective</h3>
                <p className="text-secondary-text dark:text-gray-300 leading-relaxed mb-6">
                  Create a compelling digital presence that effectively
                  communicates the brand's value proposition and engages
                  target audiences.
                </p>
                <h3 className="font-semibold text-primary-text dark:text-white mb-4">Solution</h3>
                <p className="text-secondary-text dark:text-gray-300 leading-relaxed">
                  A modern, responsive frontend built with React and Tailwind
                  CSS, featuring smooth animations and intuitive navigation.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-64 rounded-2xl border border-border dark:border-gray-700 bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 rounded-3xl border border-border dark:border-gray-700 bg-gray-50 dark:bg-dark-secondary">
                <h3 className="font-semibold text-primary-text dark:text-white mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text dark:text-gray-400">Category</span>
                    <span className="text-primary-text dark:text-white">{project.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text dark:text-gray-400">Technologies</span>
                    <span className="text-primary-text dark:text-white text-sm">
                      {project.technologies.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-8 rounded-3xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary">
                <h3 className="font-semibold text-primary-text dark:text-white mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-electric-blue"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
