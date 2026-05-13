import { create } from 'zustand'

type LoadingState = {
  counter: number
  message?: string
  locks: Record<string, boolean>
  start: (msg?: string) => void
  stop: () => void
  isLoading: () => boolean
  lock: (key: string) => boolean
  unlock: (key: string) => void
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  counter: 0,
  message: undefined,
  locks: {},
  start: (msg) => set((s) => ({ counter: s.counter + 1, message: msg ?? s.message })),
  stop: () => set((s) => ({ counter: Math.max(0, s.counter - 1), message: undefined })),
  isLoading: () => get().counter > 0,
  lock: (key: string) => {
    const locks = { ...get().locks }
    if (locks[key]) return false
    locks[key] = true
    set({ locks })
    return true
  },
  unlock: (key: string) => set((s) => ({ locks: { ...s.locks, [key]: false } })),
}))

export function startGlobalLoading(message?: string) {
  useLoadingStore.getState().start(message)
}

export function stopGlobalLoading() {
  useLoadingStore.getState().stop()
}

export function lockRequest(key: string) {
  return useLoadingStore.getState().lock(key)
}

export function unlockRequest(key: string) {
  useLoadingStore.getState().unlock(key)
}
