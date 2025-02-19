const Variant = async ({ project, part }) => {
  const variant = await getVariantForUser(projectId, textKey, pkey)

  return <div>{variant ? variant.text : 'Default Text'}</div>
}

export default Variant
