import React, { createContext, useContext } from 'react'

export const ExperimentContext = createContext(null)

export const useExperimentId = () => useContext(ExperimentContext)

const ExperimentProvider = ({ id, children }) => (
  <ExperimentContext.Provider value={id ?? null}>{children}</ExperimentContext.Provider>
)

export default ExperimentProvider
