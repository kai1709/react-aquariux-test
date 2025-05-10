import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY
const axiosWrapper = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5'
})

type WeatherAPIParams = {
  lat: number
  lon: number
}

export const getTodayWeatherInfo = async ({ lat, lon }: WeatherAPIParams) => {
  const params = {
    lat,
    lon,
    appid: API_KEY
  }
  const res = await axiosWrapper.get(`/weather`, { params })
  return res
}

export const searchCity = async ({ term }: { term: string }) => {
  const params = {
    q: term,
    appid: API_KEY
  }
  const res = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
    params
  })
  return res
}

export const getWeatherForecastInfo = async ({
  lat,
  lon
}: WeatherAPIParams) => {
  const params = {
    lat,
    lon,
    appid: API_KEY
  }
  const res = await axiosWrapper.get(`/forecast`, { params })
  return res
}
