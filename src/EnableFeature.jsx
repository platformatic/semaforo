import useFlags from './hooks/useFlags'

function EnableFeature ({ feature, component, defaultComponent, flagsProperty }) {
  const flags = useFlags(flagsProperty)
  if (flags[feature]) {
    return component()
  }
  return defaultComponent()
}

export default EnableFeature
