import React, { createContext, useContext } from 'react'

export const ProjectContext = createContext(null)

export const useProjectId = () => useContext(ProjectContext)

const ProjectProvider = ({ id, children }) => (
  <ProjectContext.Provider value={id ?? null}>{children}</ProjectContext.Provider>
)

export default ProjectProvider
