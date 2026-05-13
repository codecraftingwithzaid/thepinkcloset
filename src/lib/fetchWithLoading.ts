import { startGlobalLoading, stopGlobalLoading, lockRequest, unlockRequest } from '@/store/useLoadingStore'

export type FetchWithLoadingOptions = RequestInit & { requestKey?: string; abortOnNavigate?: boolean }

export async function fetchWithLoading(input: RequestInfo, init?: FetchWithLoadingOptions) {
  const key = init?.requestKey ?? (typeof input === 'string' ? input : JSON.stringify(input))

  // Prevent duplicate requests
  const acquired = lockRequest(key)
  if (!acquired) {
    return Promise.reject(new Error('Duplicate request blocked'))
  }

  startGlobalLoading()

  try {
    const controller = new AbortController()
    const signal = init?.signal ?? controller.signal
    const res = await fetch(input, { ...init, signal })
    return res
  } catch (err) {
    throw err
  } finally {
    stopGlobalLoading()
    unlockRequest(key)
  }
}
