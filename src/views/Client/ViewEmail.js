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
import { savedLogs } from '../../helpers/helper'
const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
))
const client = generateClient()
const ViewEmail = (contact) => {

  const [state, setSate] = useState({
    name: '',
    categoryId: '',
    email: '',
    cnic: '',
    address: '',
    hospital: '',
    designation: '',
  })


  const fetchTodos = async () => {
    await savedLogs('VIEW EMAIL', state)
  }
  let location = useLocation()
  let contacts = JSON.parse(location.state)

  useEffect(() => {
    let obj = JSON.parse(location.state);
    setSate({
      name: obj.name,
      category: obj.category_id,
      email: obj.email,
      cnic: obj.cnic,
      address: obj.address,
      hospital: obj.hospital,
      designation: obj.designation,
    })
  }, [location])
  useEffect(() => {
    fetchTodos()
  }, [])



  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '80%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>View Contact</strong>
        </CCardHeader>
        <CListGroup>
          {Object.keys(state).map((item, key) => {
            // eslint-disable-next-line react/jsx-key
            return (
              <CListGroupItem>
                {' '}
                <strong>{item.toUpperCase()}</strong>
                <span style={{ float: 'right' }}>{state[item]}</span>
              </CListGroupItem>
            )
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

export default ViewEmail
