import onNextTick from '~/onNextTick'
import memoryStore from '~/storage/memory'
import fetchProjects from './fetchProjects'
import selectVariant from './selectVariant'

const projectsKey = '__xaiku__projects__'
const variantsKey = '__xaiku__variants__'

const checkSize = projects => {
  const stringified = JSON.stringify(projects)
  return stringified.length <= 1e6 // < 1MB
}

const findMissingIds = (projects, ids) =>
  ids.length === Object.keys(projects).length ? [] : ids.filter(id => !projects[id])

export default async sdk => {
  let localVariants = null

  let storage = sdk.storage

  sdk.setProjects = projects => {
    onNextTick(() => {
      if (storage.name !== 'memory' && !checkSize(projects)) {
        console.warn('Projects size exceeds 1MB - falling back to memory storage')
        storage.delete(projectsKey)
        storage = memoryStore()
      }
      storage.set(projectsKey, projects)
    })
  }

  sdk.getProjects = async (ids, { force } = {}) => {
    if (!force && sdk.options.projects) return sdk.projects

    ids = ids ? (Array.isArray(ids) ? ids : [ids]) : []

    let projects = force ? null : storage.get(projectsKey)

    if (projects) {
      if (!force && projects) return projects

      const missingIds = findMissingIds(projects, ids)

      if (!missingIds.length) return projects

      ids = missingIds
    }

    projects = await fetchProjects(sdk, ids)

    sdk.setProjects(projects)

    return projects
  }

  sdk.getVariants = async () => {
    if (localVariants) return localVariants

    const variants = storage.get(variantsKey)

    if (!variants) return await initializeForUser()

    return variants
  }

  sdk.setVariants = variants => {
    localVariants = variants
    onNextTick(() => {
      sdk.storage.set(variantsKey, variants)
    })
  }

  sdk.selectVariants = (projects, { force } = {}) => {
    let variants = force ? null : sdk.storage.get(variantsKey)
    localVariants = variants

    if (variants) return variants

    variants = Object.keys(projects).reduce((h, uid) => {
      h[uid] = selectVariant(projects[uid], sdk.guid, uid)

      sdk.trigger('variants:select', h[uid])

      return h
    }, {})

    sdk.setVariants(variants)

    return variants
  }

  sdk.getVariant = (projectId, partId) => {
    const variants = localVariants

    if (!variants) {
      initializeForUser({ force: true }) // TODO make sure if inflight request then do not run again, or at least cancel previous
      return null
    }

    const variant = variants[projectId]

    if (!variant) return null

    if (typeof variant?.parts !== 'object') return variant

    return variant.parts[partId]
  }

  const initializeForUser = async ({ force = false } = {}) => {
    const projects = await sdk.getProjects(sdk.projectIds, { force })

    return sdk.selectVariants(projects, { force })
  }

  initializeForUser()
}
