export default hashGuid = (guid, experimentId) => {
    let hash = 0
    const combined = guid + experimentId

    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }

  const selectVariant = (variants, guid, experimentId) => {
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
    const hashValue = hashGuid(guid, experimentId) % totalWeight
    let cumulativeWeight = 0

    return variants.find(variant => {
      cumulativeWeight += variant.weight
      return hashValue < cumulativeWeight
    })
  }

  const experiments = {
    experiment_1: [
      { id: "control", weight: 50 },
      { id: "variant_A", weight: 30 },
      { id: "variant_B", weight: 20 }
    ],
    experiment_2: [
      { id: "control", weight: 70 },
      { id: "variant_X", weight: 30 }
    ]
  };
  
  const getExperiments = () => {
    const uuid = getUserUUID()
    const results = {}
  
    for (const [experimentId, variants] of Object.entries(experiments)) {
      results[experimentId] = selectVariant(variants, uuid, experimentId)
    }
  
    return results
  }