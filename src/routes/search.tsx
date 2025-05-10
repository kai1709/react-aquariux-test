import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Card, Form, FormProps, Input } from 'antd'
import { searchCity } from 'api'
import { Delete, Search, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useWeatherStore } from 'store'
import * as CryptoJS from 'crypto-js'
import { Location } from 'types'

export const Route = createFileRoute('/search')({
  component: RouteComponent
})

const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY
function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [history, setHistory] = useState<Location[]>([])
  const setLocation = useWeatherStore((state) => state.setLocation)
  const navigation = useNavigate()
  const onFinish: FormProps['onFinish'] = async (values) => {
    setIsLoading(true)
    const res = await searchCity({ term: values.term })
    setIsLoading(false)
    if (res.data.length === 0) {
      setHasError(true)
      return
    }
    const locationData: Location = res.data[0]

    // Check if same location exists in the history
    const checkDuplicationLocation = history.find(
      (h) => h.name === locationData.name && h.state === locationData.state
    )

    // Only save new location history if not exist
    if (!checkDuplicationLocation) {
      const newHistory = [...history]
      newHistory.push(locationData)
      handleSaveHistoryToLocalStorage(newHistory)
    }

    setLocation(locationData)
    navigation({ to: '/' })
    console.log('Success:', res)
  }

  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const handleSaveHistoryToLocalStorage = (historyData: Location[]) => {
    const newHistoryStringify = JSON.stringify(historyData)
    // Encrypt the history data before saving to local storage
    const encryptedNewHistory = CryptoJS.AES.encrypt(
      newHistoryStringify,
      CRYPTO_KEY
    ).toString()

    localStorage.setItem('history', encryptedNewHistory)
  }

  const handleSearchLocationFromHistory = (location: Location) => {
    setLocation(location)
    navigation({ to: '/' })
  }

  const handleRemoveHistory = (index: number) => {
    const newHistory = [...history]
    newHistory.splice(index, 1)
    setHistory(newHistory)
    handleSaveHistoryToLocalStorage(newHistory)
  }

  useEffect(() => {
    const historyLocalStorage = localStorage.getItem('history')
    if (historyLocalStorage) {
      const decryptedHistory = CryptoJS.AES.decrypt(
        historyLocalStorage,
        CRYPTO_KEY
      ).toString(CryptoJS.enc.Utf8)
      const historyArrayData = JSON.parse(decryptedHistory)
      setHistory(historyArrayData)
    }
  }, [])

  return (
    <div className="page">
      <div className="flex flex-col items-center justify-center py-3">
        <Form
          name="basic"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="flex w-[350px] gap-2">
            <div className="flex-1">
              <Form.Item label="" name="term" className="mb-1">
                <Input />
              </Form.Item>
            </div>
            <div>
              <Button loading={isLoading} type="primary" htmlType="submit">
                Search
              </Button>
            </div>
          </div>
          {hasError && (
            <div className="text-red-500">Invalid city or state</div>
          )}
        </Form>

        {history.length > 0 && (
          <Card className="card mt-4 w-[350px]">
            <div className="gray-text mb-2">History</div>
            {history.map((location: Location, index: number) => (
              <div className="mb-3 flex items-center" key={location.name}>
                <div className="flex-1">
                  {location?.name}
                  {location?.state ? `, ${location.state}` : ''}
                </div>
                <div
                  className="mr-2 cursor-pointer"
                  onClick={() => handleSearchLocationFromHistory(location)}
                >
                  <Search size={16} />
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => handleRemoveHistory(index)}
                >
                  <Trash size={16} />
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
