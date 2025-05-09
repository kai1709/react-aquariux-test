import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Form, FormProps, Input } from 'antd'
import { searchCity } from 'api'
import { useState } from 'react'
import { useWeatherStore } from 'store'

export const Route = createFileRoute('/search')({
  component: RouteComponent
})

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
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
    setLocation(res.data[0])
    navigation({ to: '/' })
    console.log('Success:', res)
  }

  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="page">
      <div className="flex items-center justify-center py-3">
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
      </div>
    </div>
  )
}
