import { Location } from 'types'
import { create } from 'zustand'

type State = {
  location: Location | null
  setLocation: (location: Location) => void
}

export const useWeatherStore = create<State>((set) => ({
  location: null,
  setLocation: (newLocation: Location) => set({ location: newLocation })
}))
