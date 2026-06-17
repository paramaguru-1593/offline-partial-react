import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Typography, Space } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { logout } from '../features/auth/authSlice'
import { selectUser } from '../features/auth/authSelectors'

const { Title, Text } = Typography

export default function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg" styles={{ body: { padding: '2.5rem' } }}>
        <Space direction="vertical" size="large" className="w-full">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <UserOutlined className="text-2xl text-indigo-600" />
            </div>
            <Title level={2} className="!mb-2">
              Welcome Admin
            </Title>
            {user?.email && (
              <Text type="secondary">{user.email}</Text>
            )}
          </div>

          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            size="large"
          >
            Logout
          </Button>
        </Space>
      </Card>
    </div>
  )
}
