const Variant = async ({ project, part }) => {
  const variant = await getVariantForUser(project, part)

  return <div>{variant ? variant.text : 'Default Text'}</div>
}

export default Variant
