import useFlags from './hooks/useFlags'
import EnableFeature from './EnableFeature'

// This is the property name used to store the flags in the user object
// Since Auth0 set them as custom claims, we are forced to apply a namespace
const DEFAULT_PROPERTY_NAME = 'https://platformatic.dev/flags'

export {
  DEFAULT_PROPERTY_NAME,
  useFlags,
  EnableFeature
}
