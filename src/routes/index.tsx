import { createFileRoute } from '@tanstack/react-router'
import { getWeatherInfo } from 'api'
import { useEffect } from 'react'
import { useWeatherStore } from 'store'

export const Route = createFileRoute('/')({
  component: Index
})

function Index() {
  const location = useWeatherStore((state) => state.location)

  const getWeatherData = async () => {
    const res = await getWeatherInfo({ lat: location.lat, lon: location.lon })
    console.log({ res })
  }
  useEffect(() => {
    if (location?.name) {
      getWeatherData()
    }
  }, [location?.name])
  return (
    <div className="page">
      <h3>Welcome Home!</h3>
    </div>
  )
}
