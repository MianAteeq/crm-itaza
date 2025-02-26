import { CRow, CSpinner } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ConnectWhatsApp from './ConnectWhatsApp'
import SendMessage from './senMessage'

const Chat = () => {
  const [isConnected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    callApi()
    const interval = setInterval(() => callApi(), 10000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  const callApi = async () => {
    const response = await axios.get('https://iadsr.fissionmonster.com/api/get/instance')
    console.log(response.data.status)

    if (response.data.status === true) {
      setConnected(true)
      setLoading(false)
      localStorage.setItem('wa_status', true)
    } else {
      setConnected(false)
      setLoading(false)
      localStorage.setItem('wa_status', false)
    }
  }

  return (
    <CRow>
      {loading === true ? (
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      ) : isConnected === true ? (
        <SendMessage />
      ) : (
        <ConnectWhatsApp />
      )}
    </CRow>
  )
}

export default Chat
