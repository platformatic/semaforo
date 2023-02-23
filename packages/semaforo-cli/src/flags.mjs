import getManagementClient from './get-management-client.mjs'
import { parseArgs } from 'node:util'
import { printTable } from 'console-table-printer'

const validateArgs = (args) => {
  const options = {
    userId: {
      type: 'string',
      short: 'u'
    },
    flag: {
      type: 'string',
      short: 'f'
    }
  }

  const {
    values: { userId, flag }
  } = parseArgs({ args, options, strict: false })

  if (!userId) {
    console.error('userId is required')
    process.exit(1)
  }

  if (!flag) {
    console.error('flag is required')
    process.exit(1)
  }

  return {
    userId,
    flag
  }
}

const validateArgsFlag = (args) => {
  const options = {
    flag: {
      type: 'string',
      short: 'f'
    }
  }

  const {
    values: { flag }
  } = parseArgs({ args, options, strict: false })

  if (!flag) {
    console.error('flag is required')
    process.exit(1)
  }

  return {
    flag
  }
}

const getUser = async (userId, management) => {
  try {
    const user = await management.getUser({ id: userId })
    const userToPrint = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      nickname: user.nickname
    }
    console.log('----------------------------------------')
    console.log(`${JSON.stringify(userToPrint, null, 2)}`)
    const userMetadata = user.user_metadata || {}
    const flags = Object.keys(userMetadata.flags || [])
    console.log('Current flags:', flags)
    console.log('----------------------------------------')
    return user
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

export const setFlag = async (args) => {
  const { userId, flag } = validateArgs(args)
  const management = await getManagementClient()
  const user = await getUser(userId, management)
  const userMetadata = user.user_metadata || {}
  const flags = userMetadata.flags || {}

  if (flags[flag]) {
    console.log(`Flag ${flag} already set`)
    process.exit(0)
  }

  const newUserMetadata = {
    ...userMetadata,
    flags: {
      ...flags,
      [flag]: true
    }
  }
  await management.updateUserMetadata({ id: userId }, newUserMetadata)
  console.log(`Flag ${flag} set`)
  await getUser(userId, management)
}

export const unsetFlag = async (args) => {
  const { userId, flag } = validateArgs(args)
  const management = await getManagementClient()
  const user = await getUser(userId, management)

  const userMetadata = user.user_metadata || {}
  const flags = userMetadata.flags || {}

  if (!flags[flag]) {
    console.log(`Flag ${flag} not set, exiting`)
    process.exit(0)
  }

  delete flags[flag]
  const newUserMetadata = {
    ...userMetadata,
    flags: {
      ...flags
    }
  }
  await management.updateUserMetadata({ id: userId }, newUserMetadata)
  console.log(`Flag ${flag} unset`)
  await getUser(userId, management)
}

export const view = async (args) => {
  const options = {
    userId: {
      type: 'string',
      short: 'u'
    }
  }

  const {
    values: { userId }
  } = parseArgs({ args, options, strict: false })

  if (!userId) {
    console.error('userId is required')
    process.exit(1)
  }

  const management = await getManagementClient()
  await getUser(userId, management)
}

export const clean = async (args) => {
  const options = {
    userId: {
      type: 'string',
      short: 'u'
    }
  }
  const {
    values: { userId }
  } = parseArgs({ args, options, strict: false })

  if (!userId) {
    console.error('userId is required')
    process.exit(1)
  }
  const management = await getManagementClient()
  const user = await management.getUser({ id: userId })
  const userMetadata = user.user_metadata || {}
  const newUserMetadata = {
    ...userMetadata,
    flags: {}
  }
  await management.updateUserMetadata({ id: userId }, newUserMetadata)
  console.log(`Flags cleaned for user ${userId}`)
  await getUser(userId, management)
}

export const list = async (args) => {
  const management = await getManagementClient()
  const users = []
  const pageSize = 100
  while (true) {
    const page = Math.floor(users.length / pageSize)

    const { users: usersPage, length: usersFetched } = await management.getUsers({
      include_totals: true,
      per_page: pageSize,
      page
    })
    users.push(...usersPage)
    if (usersFetched < pageSize) {
      break
    }
  }
  const usersToPrint = users.map((user) => {
    const userMetadata = user.user_metadata || {}
    const flags = Object.keys(userMetadata.flags || [])
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      nickname: user.nickname,
      flags
    }
  })

  printTable(usersToPrint)
}

export const setAllFlag = async (args) => {
  const { flag } = validateArgsFlag(args)
  const management = await getManagementClient()
  const users = await management.getUsers()

  for (const user of users) {
    console.log(`Setting flag ${flag} for user ${user.user_id}`)
    const userMetadata = user.user_metadata || {}
    const flags = userMetadata.flags || {}
    const newUserMetadata = {
      ...userMetadata,
      flags: {
        ...flags,
        [flag]: true
      }
    }
    await management.updateUserMetadata({ id: user.user_id }, newUserMetadata)
  }
  console.log(`Flag ${flag} set on all users`)
}

export const unsetAllFlag = async (args) => {
  const { flag } = validateArgsFlag(args)
  const management = await getManagementClient()
  const users = await management.getUsers()

  for (const user of users) {
    console.log(`Unsetting flag ${flag} for user ${user.user_id}`)

    const userMetadata = user.user_metadata || {}
    const flags = userMetadata.flags || {}

    delete flags[flag]
    const newUserMetadata = {
      ...userMetadata,
      flags: {
        ...flags
      }
    }
    await management.updateUserMetadata({ id: user.user_id }, newUserMetadata)
  }
  console.log(`Flag ${flag} unset for all users`)
}
