import { createFileRoute } from '@tanstack/react-router'
import { Card } from 'antd'
import { getTodayWeatherInfo, getWeatherForecastInfo } from 'api'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useWeatherStore } from 'store'
import { FormattedForecastData, WeatherAPIResponse, WeatherData } from 'types'

export const Route = createFileRoute('/')({
  component: Index
})

function Index() {
  const location = useWeatherStore((state) => state.location)
  const [todayWeatherInfo, setTodayWeatherInfo] = useState<WeatherData | null>(
    null
  )
  const [forecastWeatherInfo, setWeatherForecastInfo] =
    useState<FormattedForecastData | null>(null)
  const getWeatherData = async () => {
    const res = await getTodayWeatherInfo({
      lat: location!.lat,
      lon: location!.lon
    })
    const data = {
      humidity: res.data.main.humidity,
      temp: res.data.main.temp - 273.15,
      visibility: res.data.visibility,
      weatherDescription: res.data.weather[0].description,
      weatherIcon: res.data.weather[0].icon,
      windSpeed: res.data.wind.speed
    }
    setTodayWeatherInfo(data)
  }

  const getWeatherForecastData = async () => {
    const res = await getWeatherForecastInfo({
      lat: location!.lat,
      lon: location!.lon
    })

    const todayDate = dayjs().format('DD MMMM')
    const result: FormattedForecastData = {}
    res.data.list.forEach((data: WeatherAPIResponse) => {
      const dateText = data.dt_txt.split(' ')[0]
      const hourText = data.dt_txt.split(' ')[1]
      const dateString = dayjs(dateText).format('DD MMMM')
      const label = dateString === todayDate ? 'Today' : dateString
      const weatherData = {
        time: `${hourText.split(':')[0]}:${hourText.split(':')[1]}`,
        icon: data.weather[0].icon,
        description: data.weather[0].description,
        maxTemp: data.main.temp_max - 273.15,
        minTemp: data.main.temp_min - 273.15
      }
      const weatherArrayData = result[label]
      if (!weatherArrayData) {
        result[label] = [weatherData]
      } else {
        weatherArrayData.push(weatherData)
        result[label] = weatherArrayData
      }
    })
    setWeatherForecastInfo(result)
  }

  useEffect(() => {
    if (location?.name) {
      getWeatherData()
      getWeatherForecastData()
    }
  }, [location?.name])
  return (
    <div className="page">
      <div className="flex items-center justify-center py-3">
        <div className=" w-[350px] gap-2">
          {todayWeatherInfo && (
            <Card className="card  w-full">
              <div className="fon text-lg">
                {dayjs().format('MMMM DD, YYYY')}
              </div>
              <div className="flex">
                <div className="flex-1">
                  <img
                    src={`https://openweathermap.org/img/wn/${todayWeatherInfo?.weatherIcon}@2x.png`}
                  />
                </div>
                <div className="flex-1 text-center text-xl">
                  <div className="text-3xl font-semibold">
                    {todayWeatherInfo?.temp.toFixed(1)}&deg;C
                  </div>
                  {todayWeatherInfo?.weatherDescription}
                </div>
              </div>
              <div className="flex">
                <div className="flex-1 text-center">
                  <div className="gray-text">Humidity</div>
                  <div className="font-bold">{todayWeatherInfo?.humidity}%</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="gray-text">Winds</div>
                  <div className="font-bold">
                    {todayWeatherInfo?.windSpeed}m/s
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="gray-text">Humidity</div>
                  <div className="font-bold">{todayWeatherInfo?.humidity}%</div>
                </div>
              </div>
            </Card>
          )}

          {forecastWeatherInfo && (
            <div className="mt-4">
              {Object.keys(forecastWeatherInfo).map((date: string) => (
                <Card key={date} className="card mb-4">
                  <div className="gray-text mb-2">{date}</div>
                  {forecastWeatherInfo[date].map((time) => (
                    <div
                      className="mb-2 flex items-center"
                      key={`${date}-${time.time}`}
                    >
                      <div className="font-bold">{time.time}</div>
                      <div className="px-1">
                        <img
                          src={`https://openweathermap.org/img/wn/${time.icon}.png`}
                        />
                      </div>
                      <div className="gray-text flex-1">
                        {time.maxTemp.toFixed(2)} / {time.minTemp.toFixed(2)}{' '}
                        &deg;C
                      </div>
                      <div>{time.description}</div>
                    </div>
                  ))}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
