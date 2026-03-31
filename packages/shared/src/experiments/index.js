import onNextTick from '~/onNextTick'
import { stores, storeNames, checkSizeForCookie, checkSizeForLocalStorage } from '~/storage'
import fetchExperiments from './fetchExperiments'
import selectVariant from './selectVariant'

const experimentsKey = '__xaiku__experiments__'
const variantsKey = '__xaiku__variants__'

const checkSize = (experiments, storeName) => {
  switch (storeName) {
    case storeNames.cookie:
      return [checkSizeForCookie(experiments), stores.localStorage]
    case storeNames.localStorage:
    case storeNames.sessionStorage:
      return [checkSizeForLocalStorage(experiments), stores.memory]
    case storeNames.memory:
      return [true]
    default:
      return [true, stores.memory]
  }
}

const findMissingIds = (experiments, ids) =>
  ids.length === Object.keys(experiments).length ? [] : ids.filter(id => !experiments[id])

export default async sdk => {
  let localVariants = sdk.options.variants ?? null

  let storage = sdk.storage

  sdk.setExperiments = experiments => {
    onNextTick(() => {
      const [sizeIsOk, fallbackStore] = checkSize(experiments, storage.name)
      if (storage.name !== storeNames.memory && !sizeIsOk) {
        console.warn('Experiments size exceeds storage size validation')
        storage.delete(experimentsKey)
        storage = fallbackStore()
      }
      storage.set(experimentsKey, experiments)
    })
  }

  sdk.getExperiments = async (ids, { force } = {}) => {
    if (!force && sdk.options.experiments && Object.keys(sdk.options.experiments).length) {
      if (!storage.get(experimentsKey)) sdk.setExperiments(sdk.options.experiments)

      return sdk.options.experiments
    }

    ids = ids ? (Array.isArray(ids) ? ids : [ids]) : []

    const storageExperiments = storage.get(experimentsKey)
    let experiments = force
      ? null
      : !storageExperiments || !Object.keys(storageExperiments).length
        ? null
        : storageExperiments

    if (experiments) {
      if (!force && experiments) return experiments

      const missingIds = findMissingIds(experiments, ids)

      if (!missingIds.length) return experiments

      ids = missingIds
    }

    experiments = await fetchExperiments(sdk, ids)

    sdk.setExperiments(experiments)
    sdk.trigger('experiments:fetched', experiments)

    return experiments
  }

  sdk.getVariants = () => {
    if (localVariants) return localVariants

    const storageVariants = storage.get(variantsKey)

    if (storageVariants && Object.keys(storageVariants).length) return storageVariants

    return null
  }

  sdk.setVariants = variants => {
    localVariants = variants
    onNextTick(() => sdk.storage.set(variantsKey, variants))
  }

  sdk.selectVariants = (experiments, { force } = {}) => {
    if (!experiments) return null

    let variants = force ? null : sdk.getVariants()

    if (variants) return variants

    variants = Object.keys(experiments).reduce((h, uid) => {
      h[uid] = selectVariant(experiments[uid], sdk.guid, uid)

      sdk.trigger('variants:select', h[uid])

      return h
    }, {})

    sdk.setVariants(variants)

    return variants
  }

  sdk.on('experiments:fetched', experiments => sdk.selectVariants(experiments, { force: true }))

  sdk.getVariant = (experimentId, { control = false } = {}) => {
    const variants = sdk.getVariants()

    if (!variants) {
      if (sdk.options.dev) console.warn('Variants not found', experimentId)
      return null
    }

    const variant = variants[experimentId]

    if (!variant) {
      if (sdk.options.dev) console.warn('Variant not found', experimentId)
      return null
    }

    return control ? variant.control : variant.selected
  }

  sdk.getVariantId = experimentId => sdk.getVariant(experimentId)?.id ?? null

  sdk.getVariantText = (experimentId, partId, { control = false } = {}) => {
    const variant = sdk.getVariant(experimentId, { control })

    if (!variant) return null
    if (!variant?.parts || typeof variant.parts !== 'object') return variant

    if (!variant.parts[partId]) {
      if (sdk.options.dev) console.warn('Variant text not found', experimentId, partId)
      return null
    }

    return variant.parts[partId]
  }

  if (!sdk.options.skipExperiments) await sdk.getExperiments(sdk.experimentIds)
}
