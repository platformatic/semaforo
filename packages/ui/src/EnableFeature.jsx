import useFlags from './hooks/useFlags'

function EnableFeature ({ feature, component, defaultComponent, namespace }) {
  const flags = useFlags(namespace)
  if (flags[feature]) {
    return component()
  }
  return defaultComponent()
}

export default EnableFeature
