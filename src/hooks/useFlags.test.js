import { renderHook } from '@testing-library/react-hooks'
import { expect, test, vi } from 'vitest'
import { useAuth0 } from '@auth0/auth0-react'
import useFlags from './useFlags'

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn().mockReturnValue({
    user: {
      sub: '123',
      nickname: 'testuser',
      email: 'test@test.org',
      'https://platformatic.dev/flags': {
        ff1: true,
        ff2: true
      }
    }
  })
}))

test('get the flags from the user with defaults', () => {
  const { result } = renderHook(() => useFlags())
  expect(result.current).toEqual({
    ff1: true,
    ff2: true
  })
})

test('get the flags from the user using passed property name', () => {
  const flagsProperty = 'http://test/flags'
  vi.mocked(useAuth0).mockReturnValue({
    user: {
      sub: '123',
      nickname: 'testuser',
      email: 'test@test.org',
      [flagsProperty]: {
        ff1: true,
        ff2: true
      }
    }
  })

  const { result } = renderHook(() => useFlags(flagsProperty))
  expect(result.current).toEqual({
    ff1: true,
    ff2: true
  })
})

test('get the flags as empty object if there are no flags set on user', () => {
  const flagsProperty = 'http://test/flags'
  vi.mocked(useAuth0).mockReturnValue({
    user: {
      sub: '123',
      nickname: 'testuser',
      email: 'test@test.org'
    }
  })

  const { result } = renderHook(() => useFlags(flagsProperty))
  expect(result.current).toEqual({})
})
