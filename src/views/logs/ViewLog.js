/* eslint-disable react/jsx-key */
import React from 'react'
import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSelect,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import { IMaskMixin } from 'react-imask'
import { useLocation, useNavigate } from 'react-router-dom'
const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
))
const client = generateClient()
const ViewLog = (contact) => {
  const [state, setSate] = useState({
    email: '',
    date: '',
    time: '',
    logType: '',
    data: '',
  })

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Category.list()
    setCategory(items)
  }
  let location = useLocation()
  let contacts = JSON.parse(location.state)

  useEffect(() => {
    let obj = JSON.parse(location.state)
    console.log(obj)
    setSate({
      email: obj?.email,
      date: obj?.date,
      time: obj?.time,
      logType: obj?.logType,
      data: JSON.parse(obj?.logObject),
    })
  }, [location])
  useEffect(() => {
    fetchTodos()
  }, [])

  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '80%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>View Logs</strong>
        </CCardHeader>
        <CListGroup>
          <CListGroupItem>
            {' '}
            <strong>Log Create By</strong>
            <span style={{ float: 'right' }}>{state.email}</span>
          </CListGroupItem>
          <CListGroupItem>
            {' '}
            <strong>Date</strong>
            <span style={{ float: 'right' }}>{state.date}</span>
          </CListGroupItem>
          <CListGroupItem>
            {' '}
            <strong>Time</strong>
            <span style={{ float: 'right' }}>{state.time}</span>
          </CListGroupItem>
          <CListGroupItem>
            {' '}
            <strong>Log Type</strong>
            <span style={{ float: 'right' }}>{state.logType}</span>
          </CListGroupItem>
        </CListGroup>
        <CListGroup>
          {Object.keys(state.data).map((item, key) => {
            // eslint-disable-next-line react/jsx-key

            if (item.toUpperCase() !== 'CREATEDAT' && item.toUpperCase() !== 'UPDATEDAT') {
              return (
                <CListGroupItem>
                  {' '}
                  <strong>{item.toUpperCase()}</strong>
                  <span style={{ float: 'right' }}>{state.data[item]}</span>
                </CListGroupItem>
              )
            }
          })}
        </CListGroup>
      </CCard>
    )
  }
  return (
    <CRow>
      <CCol xs={12}>{createForm()}</CCol>
    </CRow>
  )
}

export default ViewLog
