export const ProjectCard = ({ project }) => {
    return (
      <div className="project-card">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <span>Status: {project.status}</span>
      </div>
    );
  };