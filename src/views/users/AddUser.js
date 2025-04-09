/* eslint-disable prettier/prettier */
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
  CFormCheck,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Spinner, Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import { IMaskMixin } from 'react-imask'
import { useNavigate } from 'react-router-dom'
import { addContact, checkUserLogin, CLIENT_ID, initGoogleAPI, signInGoogle } from '../../helpers/GoogleAuth'
import { loadAuth2, loadGapiInsideDOM } from 'gapi-script'
import { savedLogs, showSuccessMessage } from '../../helpers/helper'
import axios from 'axios'
import { signUp } from 'aws-amplify/auth'
const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
))
const client = generateClient()
const AddUser = () => {
  const [categories, setCategory] = useState([])
  const [permission_id, setPermission] = useState([])
  const [state, setSate] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [id, setID] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHospital, setShowHospital] = useState(false)
  const [error, setError] = useState('')
  const [email_error, setEmailError] = useState('')
  const [gapi, setGapi] = useState(null)
  const [user, setUser] = useState(null);
  const navigate = useNavigate()
  const fetchTodos = async () => {
     await axios.get('https://iadsr.fissionmonster.com/api/get/permissions').then(async (response) => {
          const data = response.data
          setCategory(data.data)
        })
  }

  // useEffect(() => {

  //   initGoogleAPI();
  // }, [])



  useEffect(() => {
    fetchTodos()
  }, [])

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const validatePassword = (pwd) => {
    const newErrors = [];
    if(pwd === '') {
      return [];
    }
    if (pwd.length < 8) newErrors.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(pwd)) newErrors.push("Password must contain an uppercase letter.");
    if (!/[a-z]/.test(pwd)) newErrors.push("Password must contain a lowercase letter.");
    if (!/[0-9]/.test(pwd)) newErrors.push("Password must contain a number.");
    if (!/[!@#$%^&*]/.test(pwd)) newErrors.push("Password must contain a special character (!@#$%^&*).");
    return newErrors;
  };
  const saveDate = async () => {





    if (!state.name.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }
    if (!state.password.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }
    if (state.email.trim() !== '') {
      if (validateEmail(state.email) === false) {
        setEmailError('Email is Invalid')
        return
      } else {
        setEmailError('')
      }
    }
    if(validatePassword(state.password).length > 0) {
      // setError('Password is Invalid')
      return
    }

    setLoading(true)




    const { isSignUpComplete, userId, nextStep } = await signUp({
      name: state.name,
      username: state.email,
      password: state.password,
      options: {
        userAttributes: {
          email: state.email,
        },
      },
    })

    let obj = {
      name: state.name,
      vender_id: userId,
      email: state.email,
      password: state.password,
      permission_id: permission_id,
    }
    try {
      const response = await axios.post('https://iadsr.fissionmonster.com/api/save/users', {
        name: state.name,
        vender_id: userId,
        email: state.email,
        password: state.password,
        permission_id: permission_id,
      });
      setLoading(false)
      setSate({
        name: '',
        email: '',
        password: '',
      })
      setPermission([])
      console.log('Server response:', response.data);
      showSuccessMessage('User Saved Successfully!')
      navigate('/all/users')
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Something went wrong.');
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
  }
  )
  console.log(permission_id)
}
const getChecked = (e) => {


 let exist=permission_id.filter((item) => item == e);
 if(exist.length > 0){
  return true
  }else{
    return false
  }
}

  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>{id ? 'Update' : 'Add'} User</strong>
        </CCardHeader>
        <CForm>

          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Name</CFormLabel>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              name="name"
              value={state.name}
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
              onChange={(e) => setSate({ ...state, email: e.target.value })}
              placeholder="Add Email"
            />
            <p style={{ color: 'red' }}>{email_error !== '' ? email_error : ''}</p>
            <p style={{ color: 'red' }}>{!state.email ? error : ''}</p>
          </div>


          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Password</CFormLabel>
            <CFormInput
              type="password"
              id="exampleFormControlInput1"
              name="password"
              value={state.password}
              onChange={(e) => setSate({ ...state, password: e.target.value })}
              placeholder="Add Password"
            />
            <p style={{ color: 'red' }}>{!state.password ? error : ''}</p>
            {validatePassword(state.password).length > 0 && (
              <ul style={{ color: 'red' }}>
                {validatePassword(state.password).map((error_password, index) => (
                  <li key={index}>{error_password}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Permissions</CFormLabel>

            {categories.map((item => {
              if(getChecked(item.id) === true){
              return (
                <CFormCheck id={capitalizeFirstLetter(item.name.replace('_',' '))} checked value={item.id}  onChange={(e) => handleChangePermission(e.target.value)} label={capitalizeFirstLetter(item.name.replace('_',' '))} />
              )
              }else{
                return (
                  <CFormCheck id={capitalizeFirstLetter(item.name.replace('_',' '))} value={item.id}  onChange={(e) => handleChangePermission(e.target.value)} label={capitalizeFirstLetter(item.name.replace('_',' '))} />
                )
              }
            }
            ))}
            <p style={{ color: 'red' }}>{permission_id.length===0 ? error : ''}</p>
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

export default AddUser
