import onAfterNextFrame from '@/onAfterNextFrame'
import memoryStore from '@/storage/memory'
import fetchProjects from './fetchProjects'
import selectVariant from './selectVariant'

const projectsKey = '@xaiku/projects'
const variantsKey = '@xaiku/variants'

const checkSize = projects => {
  const stringified = JSON.stringify(projects)
  return stringified.length <= 1e6 // < 1MB
}

const findMissingIds = (projects, ids) =>
  ids.length === projects.ids ? [] : ids.filter(id => !projects.find(project => project.id === id))

export default async sdk => {
  let localVariants = null
  let storage = sdk.storage

  sdk.setProjects = projects => {
    onAfterNextFrame(() => {
      if (storage.name !== 'memory' && !checkSize(projects)) {
        console.warn('Projects size exceeds 1MB - falling back to memory storage')
        storage.delete(projectsKey)
        storage = memoryStore()
      }
      storage.set(projectsKey, projects)
    })
  }

  sdk.getProjects = async (ids, { force } = {}) => {
    ids = ids ? (Array.isArray(ids) ? ids : [ids]) : []

    let projects = force ? null : storage.get(projectsKey)

    if (projects) {
      const missingIds = findMissingIds(projects, ids)

      if (!missingIds.length) return projects
    }

    projects = await fetchProjects(sdk)

    sdk.setProjects(projects)

    return projects
  } 

  sdk.getVariants = async ({ quickReturn } = {}) => {
    if (localVariants) return localVariants

    const variants = storage.get(variantsKey)

    if (!variants) return await initializeForUser()

    return variants
  }

  sdk.setVariants = variants => onAfterNextFrame(() => {
    sdk.storage.set(variantsKey, variants)
    localVariants = variants
  })

  sdk.selectVariants = (projects, { force } = {}) => {
    let variants = force ? null : sdk.storage.get(variantsKey)

    if (variants) return variants

    variants = Object.keys(projects).reduce((h, uid) => {
      h[uid] = selectVariant(projects[uid], sdk.guid, uid)

      sdk.trigger('variants:select', h[project.uid])

      return h
    }, {})

    sdk.setVariants(variants)

    return variants
  }

  sdk.getVariant = async (projectId, partId) => {
    const variants = await sdk.getVariants()

    if (!variants) {
      initializeForUser() // TODO make sure if inflight request then do not run again, or at least cancel previous
      return null
    }

    const variant = variants[projectId]

    if (!variant) return null

    if (typeof variant !== 'object') return variant

    return variant[partId]
  }

  const initializeForUser = async () => {
    const projects = await sdk.getProjects(sdk.projectIds, { force: true })

    return sdk.selectVariants(projects, { force: true })
  }

  initializeForUser()
}
