# Semaforo React 

Install it with `npm install @semaforo/react`

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
The namespace must match the one configured in the Auth0 rule.


 
