/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-no-undef */
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
  CFormCheck,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import { IMaskMixin } from 'react-imask'
import { useLocation, useNavigate } from 'react-router-dom'
import { savedLogs, showSuccessMessage } from '../../helpers/helper'
import axios from 'axios'
const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
))
const client = generateClient()
const EditUser = (contact) => {
  const [categories, setCategory] = useState([])
  const [permission_id, setPermission] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [state, setSate] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
  })
  const [id, setID] = useState('')
  const [error, setError] = useState('')

  const fetchTodos = async () => {
    await axios.get('https://iadsr.fissionmonster.com/api/get/permissions').then(async (response) => {
      const data = response.data
      setCategory(data.data)
    })
  }
  let location = useLocation()

  useEffect(() => {
    let obj = JSON.parse(location.state)
    setSate({
      id: obj.id,
      name: obj.name,
      email: obj.email,
    })
    obj.permissions.forEach((item) => {
      handleChangePermission(item.id.toString())
    })
  }, [location])
  useEffect(() => {
    fetchTodos()
  }, [])

  const validatePassword = (pwd) => {
    const newErrors = []
    if (pwd === '') {
      return []
    }
    if (pwd.length < 8) newErrors.push('Password must be at least 8 characters.')
    if (!/[A-Z]/.test(pwd)) newErrors.push('Password must contain an uppercase letter.')
    if (!/[a-z]/.test(pwd)) newErrors.push('Password must contain a lowercase letter.')
    if (!/[0-9]/.test(pwd)) newErrors.push('Password must contain a number.')
    if (!/[!@#$%^&*]/.test(pwd))
      newErrors.push('Password must contain a special character (!@#$%^&*).')
    return newErrors
  }
  const saveDate = async () => {


    setLoading(true)

    try {
      const response = await axios.post('https://iadsr.fissionmonster.com/api/update/users', {
        id: state.id,
        permission_id: permission_id,
      })
      setLoading(false)
      setPermission([])
      console.log('Server response:', response.data)
      showSuccessMessage('User Update Successfully!')
      navigate('/all/users')
    } catch (error) {
      console.error('Error submitting form:', error)
      showSuccessMessage('Something went wrong.')
    }
  }
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const handleChangePermission = (e) => {
    setPermission((prev) => {
      if (prev.includes(e)) {
        return prev.filter((item) => item !== e)
      } else {
        return [...prev, e]
      }
    })
    console.log(permission_id)
  }
  const getChecked = (e) => {
    let exist = permission_id.filter((item) => item == e)
    if (exist.length > 0) {
      return true
    } else {
      return false
    }
  }
  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>Update User</strong>
        </CCardHeader>
        <CForm>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Name</CFormLabel>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              name="name"
              value={state.name}
              disabled
              onChange={(e) => setSate({ ...state, name: e.target.value })}
              placeholder="Add Name"
            />
            <p style={{ color: 'red' }}>{!state.name ? error : ''}</p>
          </div>

          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Email</CFormLabel>
            <CFormInput
              type="email"
              id="exampleFormControlInput1"
              name="email"
              value={state.email}
              disabled
              onChange={(e) => setSate({ ...state, email: e.target.value })}
              placeholder="Add Email"
            />
            {/* <p style={{ color: 'red' }}>{email_error !== '' ? email_error : ''}</p> */}
            <p style={{ color: 'red' }}>{!state.email ? error : ''}</p>
          </div>


          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Permissions</CFormLabel>

            {categories.map((item) => {
              if (getChecked(item.id) === true) {
                return (
                  <CFormCheck
                    id={capitalizeFirstLetter(item.name.replace('_', ' '))}
                    checked
                    value={item.id}
                    onChange={(e) => handleChangePermission(e.target.value)}
                    label={capitalizeFirstLetter(item.name.replace('_', ' '))}
                  />
                )
              } else {
                return (
                  <CFormCheck
                    id={capitalizeFirstLetter(item.name.replace('_', ' '))}
                    value={item.id}
                    onChange={(e) => handleChangePermission(e.target.value)}
                    label={capitalizeFirstLetter(item.name.replace('_', ' '))}
                  />
                )
              }
            })}
            <p style={{ color: 'red' }}>{permission_id.length === 0 ? error : ''}</p>
            {/* <CFormCheck id="flexCheckDefault" label="Default checkbox" />
                  <CFormCheck id="flexCheckDefault" label="Default checkbox" /> */}
          </div>

          <div className="m-3">
            <div className="d-grid gap-2 col-6 mx-auto">
              <CButton
                color="primary"
                style={{ marginTop: '4%' }}
                loading={loading}
                onClick={() => saveDate()}
              >
                {loading === true ?? <Spinner as="span" animation="grow" />}
                {loading ? ' ...Saving Record' : id ? 'Update' : 'Submit'}
              </CButton>
            </div>
          </div>
        </CForm>
      </CCard>
    )
  }
  return (
    <CRow>
      <CCol xs={12}>{createForm()}</CCol>
    </CRow>
  )
}

export default EditUser
