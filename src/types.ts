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

export type WeatherData = {
  humidity: number
  temp: number
  visibility: number
  weatherDescription: string
  weatherIcon: string
  windSpeed: number
}

export type FormattedForecastData = {
  [key: string]: FormattedDateForcastData[]
}

export type FormattedDateForcastData = {
  time: string
  icon: string
  description: string
  maxTemp: number
  minTemp: number
}

export type WeatherAPIResponse = {
  weather: {
    icon: string
    description: string
  }[]
  main: {
    temp_max: number
    temp_min: number
  }
  dt_txt: string
}
