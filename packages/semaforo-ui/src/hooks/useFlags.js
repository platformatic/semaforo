import { useAuth0 } from '@auth0/auth0-react'
import { DEFAULT_NAMESPACE } from '../index'

function useFlags (namespace = DEFAULT_NAMESPACE) {
  const { user = {} } = useAuth0()
  const flags = user[namespace] || {}
  return flags
}

export default useFlags
