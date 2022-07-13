import React from 'react'
import ReactDOM from 'react-dom/client'
import { Suspense } from "react"
import {App} from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense>
      <App />
    </Suspense>
  </React.StrictMode>
)
