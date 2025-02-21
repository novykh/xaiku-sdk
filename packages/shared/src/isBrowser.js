import hasDocument from '~/hasDocument'

export default () => typeof window !== 'undefined' && hasDocument()
