import { vi, expect } from 'vitest'
import { screen, render } from '@testing-library/react'

import EnableFeature from './EnableFeature'

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn().mockReturnValue({
    user: {
      sub: '123',
      nickname: 'testuser',
      email: 'test@test.org',
      'https://platformatic.cloud/flags': {
        test: true
      }
    }
  })
}))

const NewFeature = () => (<div>New Feature</div>)
const OldFeature = () => (<div>Old Feature</div>)

test('Enable the `test` feature', async () => {
  render(
    <EnableFeature feature='test' component={NewFeature} defaultComponent={OldFeature} />
  )
  expect(screen.getByText(/New Feature/i)).toBeDefined()
  expect(() => screen.getByText('Old Feature')).toThrow()
})

test('Not enable the `notset` feature', async () => {
  render(
    <EnableFeature feature='nostset' component={NewFeature} defaultComponent={OldFeature} />
  )
  expect(screen.getByText(/Old Feature/i)).toBeDefined()
  expect(() => screen.getByText('New Feature')).toThrow()
})
