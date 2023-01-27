# Semaforo Feature Flag library

This is a library plus tools to provides a way to manage feature flags in React UI application that uses Auth0 for authentication.
The assumption is that feature flags are stored in Auth0 and are available in the user object which is populated using the user's`user_metadata` field.
A feature flag is set if the property is present.

```json
{
  "user_metadata": {
    "flags": {
      "new_feature": true,
      "newest_feature": true
    }
  }
}
```
Feature Flags are conceptually boolean values. If present or thruty, the flag is set, otherwise it is not.

[Since this `user` object is created from the `idToken`](https://community.auth0.com/t/how-do-i-get-user-metadata-in-the-login/71465), we must specify a namespace for this `flags` custom claim.

In Auth0 this can be configured in a post login rule:

```js
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://platformatic.dev'  
  // Feature Flags from user_metadata
  const { flags } = event.user.user_metadata || {}
  api.idToken.setCustomClaim(`${namespace}/flags`, flags)
}

```

Then the `user` object is available in the [`useAuth0` hook](https://auth0.github.io/auth0-react/functions/useAuth0.html) and can be used to get the feature flags.

```js
const { user } = useAuth0()
const flags = user['https://platformatic.dev/flags']
```
With this library, it's not necessary to manage feature flags directly, they can be managed by
`useFlags` hook or `<EnableFeature/>` component.

## `useFlags` hook

Assuming that the `newfeature` flag can be set for some users, we can define different routes for them:

```js
const flags = useFlags();

const getRoutes = flags => {
  if (flags.newfeature) {
    return <Routes>yy
      <Route
        path='/'
        element={<App />}
      />
      <Route
       path='/applications/:id'
       element={<ProtectedRoute component={Detail} />}
      />
    </Routes>
  } 
return <Routes> 
  // default routes
</Routes>
}
```
Or we can change content dynamically:


```js
const flags = useFlags();
  return <>
    {flags.newfeature && <p>You are a basic user!</p>}
  </>
``` 

## `<EnableFeature/>`
This can be used to return a component conditionally depending on a feature flag. If the flag is not set, it returns the default.

```js
<Route
  path='/applications/:id'
    element={
      <EnableFeature
        feature="newfeature"
        component={<ProtectedRoute component={BasicDetail} />}
        default={<ProtectedRoute component={Detail} />}
      />
    }
/>
```

### Flags and `namespace`
This library assumes that flags are in `user['https://platformatic.dev/flags']` so the `namespace` is `https://platformatic.dev`. If you want to change this, you must pass the `namespace` param to both `useFlags` and `<EnableFeature />`, e.g.:

```js
const flags = useFlags("https://mynamespace")
return <>
  {flags.newfeature && <p>You are a basic user!</p>}
</>

```

```js
<Route
  path='/applications/:id'
    element={
      <EnableFeature
        feature="newfeature"
        component={<ProtectedRoute component={BasicDetail} />}
        default={<ProtectedRoute component={Detail} />}
        namespace="https://mynamespace"
      />
    }
/>
```
The namespace must be the same configured in the Auth0 rule.


 
