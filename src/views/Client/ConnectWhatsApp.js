import { CAlert, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ConnectWhatsApp = () => {
  const [isConnected, setConnected] = useState(false)
  const [qr_code, setQrCode] = useState(null)

  useEffect(() => {
    callApi()
    const interval = setInterval(() => callApi(), 10000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  const callApi = async () => {
    const response = await axios.get('https://iadsr.fissionmonster.com/api/get/qr/code')
    console.log(response.data.status)

    if (response.data.status === true) {
      setQrCode(response.data.qr_code)
    } else {
      setQrCode(null)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
          <CCardHeader>
            <strong>Connect WhatsApp </strong>
          </CCardHeader>
          <CCardBody>
            <img
              src={qr_code}
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '50%',
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ConnectWhatsApp
