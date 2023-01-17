# Platformatic Feature Flag library

This React library provides a way to manage feature flags in Dashformatic. 
The assumption is that feature flags are stored in Auth0 and are available in the
user object which is populated using the user's`user_metadata` field.
[Since this `user` object is created from the `idToken`](https://community.auth0.com/t/how-do-i-get-user-metadata-in-the-login/71465), we must specify a namespace for this `flags` custom claim.

In Auth0 this can be configured in the post login rule:

```js
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://platformatic.cloud'  
  // Feature Flags from user_metadata
  const { flags } = event.user.user_metadata || {}
  api.idToken.setCustomClaim(`${namespace}/flags`, flags)
}

```

Then the `user` object is available in the `useAuth0` hook and can be used to get the feature flags.

```js

const { user } = useAuth0()
const flags = user['https://platformatic.cloud/flags']

```
With this library, it's not necessary to manage feature flags directly, they can be managed by
`useFlags` hook or `<EnableFeature/>` component.

## `useFlags` hook

Assuming that the `public` flag can be set for some users, we can define different routes:

```js
const flags = useFlags();

const getRoutes = flags => {
  if (flags.basic) {
    return <Routes>
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
    {flags.public && <p>You are a basic user!</p>}
  </>
``` 

## `<EnableFeature/>`
This can be used to return a component conditionally depending on a feature flag. If the flag is not set, it returns the default.

```js
<Route
  path='/applications/:id'
    element={
      <EnableFeature
        feature="basic"
        component={<ProtectedRoute component={BasicDetail} />}
        default={<ProtectedRoute component={Detail} />}
      />
    }
/>
```

## Flags properties and `namespace`
This library assumes that flags are in `user['https://platformatic.cloud/flags']` so the `namespace` is `https://platformatic.cloud`. If you want to change this, you can pass the `flagProperty` param to both
`useFlags` and `<EnableFeature />`.


