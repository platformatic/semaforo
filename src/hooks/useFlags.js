import { useAuth0 } from '@auth0/auth0-react'
import { DEFAULT_PROPERTY_NAME } from '../index'

function useFlags (flagsProperty = DEFAULT_PROPERTY_NAME) {
  const { user = {} } = useAuth0()
  const flags = user[flagsProperty]
  return flags
}

export default useFlags
