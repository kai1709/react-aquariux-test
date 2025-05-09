export type State = {
  location: Location | null
  setLocation: (location: Location) => void
}
export type Location = {
  country: string
  lat: number
  lon: number
  name: string
  state: string
}
