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

  sdk.setVariants = variants => onAfterNextFrame(() => sdk.storage.set(variantsKey, variants))

  sdk.selectVariants = (projects, { force } = {}) => {
    let variants = force ? null : sdk.storage.get(variantsKey)

    if (variants) return variants

    variants = Object.keys(projects).reduce((h, uid) => {
      h[uid] = selectVariant(projects[uid], sdk.guid, uid)
      return h
    }, {})

    sdk.setVariants(variants)

    return variants
  }

  const returnFallback = payload => {
    sdk.trigger('variants:selectFallback', payload)

    return null
  }

  const returnVariant = (variant, payload) => {
    if (!variant) return returnFallback()

    sdk.trigger('variants:select', { ...payload, variant })

    return variant
  }

  sdk.getVariant = (projectId, partId) => {
    const variants = sdk.storage.get(variantsKey)

    if (!variants) {
      initializeForUser() // TODO make sure if inflight request then do not run again, or at least cancel previous
      return returnFallback()
    }

    const variant = variants[projectId]

    if (!variant) return returnFallback()

    if (typeof variant !== 'object') return variant

    return returnVariant(variant[partId])
  }

  const initializeForUser = async () => {
    const projects = await sdk.getProjects(sdk.projectIds, { force: true })

    sdk.selectVariants(projects, { force: true })
  }

  initializeForUser()
}
