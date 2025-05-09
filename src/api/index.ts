import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY
const axiosWrapper = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5'
})
export const getWeatherInfo = async ({ lat, lon }) => {
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
