import onNextTick from '~/onNextTick'
import { stores, storeNames, checkSizeForCookie, checkSizeForLocalStorage } from '~/storage'
import fetchProjects from './fetchProjects'
import selectVariant from './selectVariant'

const projectsKey = '__xaiku__projects__'
const variantsKey = '__xaiku__variants__'

const checkSize = (projects, storeName) => {
  switch (storeName) {
    case storeNames.cookie:
      return [checkSizeForCookie(projects), stores.localStorage]
    case storeNames.localStorage:
    case storeNames.sessionStorage:
      return [checkSizeForLocalStorage(projects), stores.memory]
    case storeNames.memory:
      return [true]
    default:
      return [true, stores.memory]
  }
}

const findMissingIds = (projects, ids) =>
  ids.length === Object.keys(projects).length ? [] : ids.filter(id => !projects[id])

export default async sdk => {
  let localVariants = null

  let storage = sdk.storage

  sdk.setProjects = projects => {
    onNextTick(() => {
      const [sizeIsOk, fallbackStore] = checkSize(projects, storage.name)
      if (storage.name !== storeNames.memory && !sizeIsOk) {
        console.warn('Projects size exceeds storage size validation')
        storage.delete(projectsKey)
        storage = fallbackStore()
      }
      storage.set(projectsKey, projects)
    })
  }

  sdk.getProjects = async (ids, { force } = {}) => {
    if (!force && sdk.options.projects) {
      if (!storage.get(projectsKey)) sdk.setProjects(sdk.options.projects)

      return sdk.options.projects
    }

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
    sdk.trigger('projects:fetched', projects)

    return projects
  }

  sdk.getVariants = () => {
    if (localVariants) return localVariants

    return storage.get(variantsKey)
  }

  sdk.setVariants = variants => {
    localVariants = variants
    onNextTick(() => sdk.storage.set(variantsKey, variants))
  }

  sdk.selectVariants = (projects, { force } = {}) => {
    if (!projects) return null

    let variants = force ? null : sdk.getVariants()

    if (variants) return variants

    variants = Object.keys(projects).reduce((h, uid) => {
      h[uid] = selectVariant(projects[uid], sdk.guid, uid)

      sdk.trigger('variants:select', h[uid])

      return h
    }, {})

    sdk.setVariants(variants)

    return variants
  }

  sdk.on('projects:fetched', projects => sdk.selectVariants(projects, { force: true }))

  sdk.getVariantText = (projectId, partId, { control = false } = {}) => {
    const variants = sdk.getVariants()

    if (!variants) {
      if (sdk.options.dev) console.warn('Variants not found', projectId, partId)
      return null
    }

    const variant = variants[projectId]

    if (!variant) {
      if (sdk.options.dev) console.warn('Variant not found', projectId, partId)
      return null
    }

    const key = control ? 'control' : 'selected'
    if (typeof variant?.[key]?.parts !== 'object') return variant

    if (!variant[key].parts[partId]) {
      if (sdk.options.dev) console.warn('Variant text not found', projectId, partId)
      return null
    }

    return variant[key].parts[partId]
  }

  const initializeForUser = async ({ force = false } = {}) => {
    const projects = await sdk.getProjects(sdk.projectIds, { force })

    return sdk.selectVariants(projects, { force })
  }

  if (!sdk.options.skipProjects) await initializeForUser()
}
