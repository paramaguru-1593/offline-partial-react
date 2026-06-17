import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import { store } from './app/store'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#F28B18',
            borderRadius: 8,
          },
        }}
      >
        <App />
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)
