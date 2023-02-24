# Semaforo Feature Flag System

This is a simple library with cli tools to provides a way to manage feature flags in React UI applications that use Auth0 for authentication.
The assumption is that feature flags are stored in Auth0 and are available in the user object which can be populated using the user's`user_metadata` field.
A feature flag for a user is set if the property is present.

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
Feature Flags are conceptually boolean values. If present or truthy, the flag is set, otherwise it is not.

## Auth0 Configuration

[Since this `user` object is created from the `idToken` claims](https://community.auth0.com/t/how-do-i-get-user-metadata-in-the-login/71465), we must specify a namespace for this `flags` custom claim.
In Auth0 this can be configured in a post login rule:

```js
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://platformatic.dev'  
  // Feature Flags from user_metadata
  const { flags } = event.user.user_metadata || {}
  api.idToken.setCustomClaim(`${namespace}/flags`, flags)
}
```

### Setup "default" flags for new users
Even if Feature Flags should be temporary (all they should eventually disappear) it can be useful to set a default value for a flag. This can be done in Auth0 using a `pre-user-registration` action. 
For more details see [Auth0 docs](https://auth0.com/docs/customize/actions/flows-and-triggers/pre-user-registration-flow#set-metadata-in-the-user-profile)

```js
exports.onExecutePreUserRegistration = async (event, api) => {
  api.user.setUserMetadata("flag", "default_flag_new_users");  
};
```
## Usage with React

In a React app, the `user` object is made available through the [`useAuth0` hook](https://auth0.github.io/auth0-react/functions/useAuth0.html) and can be used to get the feature flags.
However, it's not necessary to manage feature flags directly, they can be managed by `useFlags` hook or `<EnableFeature/>` components from `@platformatic/semaforo-ui`
Install it with: `npm install @platformatic/semaforo-ui`


### `useFlags` hook
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

### `<EnableFeature/>`
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

## CLI
To set feature flags for a user, you can use the `semaforo` cli tool. It can be installed globally with `npm install -g @platformatic/semaforo-cli` or cloning this repo and linking it globally from `packages/cli` using `pnpm link --global`

When installed, you need a `env` file set in the current directory with the Auth0 configuration. See [cli README](packages/semaforo-cli/README.md) for the setup and all the available commands

## Development
This project uses [pnpm](https://pnpm.io/) as package manager. To install it, run `npm install -g pnpm` and then install dependencies with `pnpm install`

