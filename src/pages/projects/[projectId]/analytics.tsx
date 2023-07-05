import React, { useEffect, useState } from 'react'

const ProjectAnalytics = () => {
  const [socketInitialized, setSocketInitialized] = useState(false)
  const [monitoringSocket, setMonitoringSocket] = useState<WebSocket | null>(
    null
  )

  const info = {
    throughput: 0,
    throughputStats: {},
    cpuUsage: 0,
    cpuUsageStats: {},
    dataTransferLoad: 0,
    dataTransferStats: {}
  }

  const sendMessage = (message: any) => {
    if (monitoringSocket && monitoringSocket.readyState === WebSocket.OPEN) {
      monitoringSocket.send(JSON.stringify(message))
      console.log(message)
    }
  }

  useEffect(() => {
    const initializeMonitoringSocket = () => {
      const protocol = 'ws://'
      const host = 'localhost:8001'
      const url = protocol + host + '/volunteer-monitoring'

      const socket = new WebSocket(url)

      socket.addEventListener('open', function () {
        setSocketInitialized(true)
        console.log('Connected to report status at ' + url)
      })

      socket.addEventListener('close', function () {
        setSocketInitialized(false)
        socket.close()
        setMonitoringSocket(null)
        console.log('Connection closed at ' + url)
      })

      socket.addEventListener('error', function () {
        setSocketInitialized(false)
        socket.close()
        setMonitoringSocket(null)
        console.log('Connection closed at ' + url)
      })

      setMonitoringSocket(socket)
    }

    initializeMonitoringSocket()

    return () => {
      if (monitoringSocket) {
        monitoringSocket.close()
      }
    }
  }, [])

  return (
    <div>
      {socketInitialized ? (
        <div>
          <p>WebSocket connection established.</p>
          <button onClick={() => sendMessage({ info })}>Send Message</button>
        </div>
      ) : (
        <p>WebSocket connection closed.</p>
      )}
    </div>
  )
}

export default ProjectAnalytics
