const hashGuid = (guid, projectId) => {
  let hash = 0
  const combined = guid + projectId

  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash)
}

export default (variants, guid, projectId) => {
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 5), 0)
  const hashValue = hashGuid(guid, projectId) % totalWeight
  let cumulativeWeight = 0

  const selected = variants.find(variant => {
    cumulativeWeight += variant.weight ?? 5
    return hashValue < cumulativeWeight
  })

  return {
    selected,
    control: selected.control ? selected : variants.find(variant => variant.control),
  }
}
