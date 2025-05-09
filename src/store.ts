import { Location } from 'types'
import { create } from 'zustand'

export const useWeatherStore = create((set) => ({
  location: null,
  setLocation: (newLocation: Location) => set({ location: newLocation })
}))
