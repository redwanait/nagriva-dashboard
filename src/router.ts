import { createContext, useContext } from 'react'
import type { Route } from './types'

export interface RouterValue {
  route: Route
  navigate: (route: Route) => void
}

export const RouterContext = createContext<RouterValue | null>(null)

export function useRouter(): RouterValue {
  const value = useContext(RouterContext)
  if (!value) {
    throw new Error('useRouter must be used inside a RouterContext provider')
  }
  return value
}
