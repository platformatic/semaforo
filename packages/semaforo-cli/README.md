# Semaforo CLI 

Basic cli to manage user Semaforo Feature Flags.

# Pre-requisites
- Node v18.11.0 (uses the nodejs's [util.parseArgs](https://nodejs.org/api/util.html#utilparseargsconfig))
- Auth0 account with a "M2M" client application configured.

## Install and Setup

Install it globally with `npm`: 
```
npm install -g @platformatic/semaforo-cli
```

Or clone this repo and from `packages/cli` link it globally:
```
pnpm link --global
```

In both cases, you need a `.env` file in the current directory with the Auth0 configuration. 

Create a file named `.env`, specifying the values for the auth0 client (login in auth0 and navigate to the application to get the values)

```
AUTH0_CLIENT_ID=xxxyyyzzz
AUTH0_CLIENT_SECRET=zzzyyyxxx
AUTH0_DOMAIN=xxx.us.auth0.com
```

This cli class auth0 with a JWT token which is cached in node_modules/.cache/semaforo (if the cli is used in a folder with a `package.json`) or ~/.cache/semaforo (otherwise).  

## Usage

### View
```
➜ semaforo view -u "github|999999"       
----------------------------------------
{
  "user_id": "github|999999",
  "name": "Marco",
  "email": "marco@platformatic.dev",
  "nickname": "marcopiraccini"
}
Current flags: []
----------------------------------------
```

### Set
```
➜ semaforo set -u "github|999999" -f ff1    
----------------------------------------
{
  "user_id": "github|999999",
  "name": "Marco",
  "email": "marco@platformatic.dev",
  "nickname": "marcopiraccini"
}
Current flags: []
----------------------------------------
Flag ff1 set
----------------------------------------
{
  "user_id": "github|999999",
  "name": "Marco",
  "email": "marco@platformatic.dev",
  "nickname": "marcopiraccini"
}
Current flags: [ 'ff1' ]
----------------------------------------
```

### Unset
```
➜ semaforo unset -u "github|999999" -f ff1
----------------------------------------
{
  "user_id": "github|999999",
  "name": "Marco",
  "email": "marco@platformatic.dev",
  "nickname": "marcopiraccini"
}
Current flags: [ 'ff1' ]
----------------------------------------
Flag ff1 unset
----------------------------------------
{
  "user_id": "github|999999",
  "name": "Marco",
  "email": "marco@platformatic.dev",
  "nickname": "marcopiraccini"
}
Current flags: []
----------------------------------------
```

### Clean
```
➜ semaforo clean -u "github|999999"           
Flags cleaned for user github|999999
----------------------------------------
{
  "user_id": "github|999999",
  "name": "Marco",
  "email": "marco@platformatic.dev",
  "nickname": "marcopiraccini"
}
Current flags: []
----------------------------------------
```

### List
```
➜ semaforo list                         
┌──────────────────┬──────────────────────────┬──────────────────────────────────┬─────────────────────────────┬───────┐
│          user_id │                     name │                            email │                    nickname │ flags │
├──────────────────┼──────────────────────────┼──────────────────────────────────┼─────────────────────────────┼───────┤
│  github|xxxxxxx  │      xxxxxxxxx@gmail.com │             xxxxxxxxxx@gmail.com │ xxxxxxxxxxxxxxxxxxxxxxxxxxx │       │
│    github|yyyyyy │                    Marco │        marco@platformatic.dev │              marcopiraccini │   ff1 │
```
### Set/unset All
These can be used to set/unset a flag for all users:

```bash
➜ semaforo setAll -f ff1
```
```bash
➜ semaforo unsetAll -f ff1
```
Both do a call for each user, so the whole process can take a while (depending on the number of users), the progress is shown in the console.


