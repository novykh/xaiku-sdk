import { SdkInstance, Options } from "@xaiku/shared"

export * from "@xaiku/shared/types"

declare function makeXaikuSdk(options?: Options): SdkInstance

export default makeXaikuSdk
