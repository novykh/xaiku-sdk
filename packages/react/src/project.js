import React, { createContext, useContext } from 'react'

export const ProjectContext = createContext(null)

export const useProjectId = () => useContext(ProjectContext)

const ProjectProvider = ({ projectId, children }) => (
  <ProjectContext.Provider value={projectId}>{children}</ProjectContext.Provider>
)

export default ProjectProvider
