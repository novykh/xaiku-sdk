import React, { createContext, useContext } from 'react'
import { useTrackView } from './useTrack'

export const ExperimentContext = createContext(null)

export const useExperimentId = () => useContext(ExperimentContext)

const ExperimentProvider = ({ id, children }) => {
  useTrackView({ experimentId: id })

  return <ExperimentContext.Provider value={id ?? null}>{children}</ExperimentContext.Provider>
}

export default ExperimentProvider
