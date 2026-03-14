// src/App.jsx
import { useState, useEffect } from 'react'
import Sidebar   from './components/Sidebar'
import TopBar    from './components/TopBar'
import AppRouter from './router/AppRouter'
import { getStatuses, getThresholds, saveStatuses, saveThresholds } from './utils/thresholds'

function App() {

  const [statuses, setStatuses]     = useState(getStatuses)
  const [thresholds, setThresholds] = useState(getThresholds)

  // Auto save whenever state changes
  useEffect(() => { saveStatuses(statuses)     }, [statuses])
  useEffect(() => { saveThresholds(thresholds) }, [thresholds])

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-56 flex-1 flex flex-col">

        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <div className="flex-1 p-8">
          <AppRouter
            statuses={statuses}
            setStatuses={setStatuses}
            thresholds={thresholds}
            setThresholds={setThresholds}
          />
        </div>

      </div>

    </div>
  )
}

export default App


