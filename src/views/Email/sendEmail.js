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
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Alert, Spinner, Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import { IMaskMixin } from 'react-imask'
import { useNavigate } from 'react-router-dom'
import { savedLogs } from '../../helpers/helper'
import Select from 'react-select'
import axios from 'axios'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import FroalaEditorComponent from 'react-froala-wysiwyg'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import FroalaEditor from 'react-froala-wysiwyg'
const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
))
const client = generateClient()
const SendEmail = () => {
  const [categories, setCategory] = useState([])
  const [state, setSate] = useState({
    emails: [],
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [showHospital, setShowHospital] = useState(false)
  const [id, setID] = useState('')
  const [error, setError] = useState('')
  const [selectedOptions, setSelectedOptions] = useState([])
  const [visibleXL, setVisibleXL] = useState(false)
  const navigate = useNavigate()
  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.EmailList.list({
      limit: 50000,
    })

    items.forEach((item) => {
      // console.log(item)
      let record = {
        id: item.email,
        email: item.email,
        category: item.category_id,
      }
      setCategory((oldArray) => [...oldArray, record])
    })
    // setCategory([records])
  }
  useEffect(() => {
    const sub = client.models.EmailList.observeQuery({ limit: 50000 }).subscribe({
      next: ({ items }) => {
        setCategory([...items])
        // setFilterItem([...items])
      },
    })

    return () => sub.unsubscribe()
  }, [])
  const [ariaFocusMessage, setAriaFocusMessage] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // fetchTodos()
  }, [])

  const removeItem = () => {
    const uniqueArray = selectedOptions.filter((value, index) => {
      const _value = JSON.stringify(value)
      return (
        index ===
        selectedOptions.findIndex((obj) => {
          return JSON.stringify(obj) === _value
        })
      )
    })

    return uniqueArray
  }

  const editRecord = (record) => {
    setVisible(true)
    setID(record.toID)
    setName(record.name)
  }
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const saveDate = async () => {
    console.log(state.emails)
    if (selectedOptions.length === 0) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }
    if (!state.subject.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }
    if (!state.message.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }

    setLoading(true)

    let obj = {
      ...state,
      emails: JSON.stringify(selectedOptions),
    }
    // obj.emails = selectedOptions

    axios
      .post('https://cms.iadsr.edu.pk/api/send/email', obj)
      .then(function (response) {
        if (response.data.status === true) {
          setSate({
            emails: [],
            subject: '',
            message: '',
          })
          setSelectedOptions([])
          setLoading(false)
          Alert('Message Send Successfully')
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  const handleChange = (e) => {
    let email = e.clipboardData.getData('Text')

    setSate({
      ...state,
      email: email,
    })
  }
  const handleChangeCnic = (e) => {
    let cnic = e.clipboardData.getData('Text').replace('-', '')

    setSate({
      ...state,
      cnic: cnic,
    })
  }
  const onMenuOpen = () => setIsMenuOpen(true)
  const onMenuClose = () => setIsMenuOpen(false)
  const onChange = (selectedOptions) => {
    if (selectedOptions.length > 0 || selectedOptions.length === 0) {
      setSelectedOptions(selectedOptions)
      return
    } else {
      setSelectedOptions((oldArray) => [...oldArray, selectedOptions])
    }
    console.log(selectedOptions)
  }
  const columns = [
    // { field: 'id', headerName: 'ID' },
    { field: 'category', headerName: 'Category', width: 300 },
    { field: 'email', headerName: 'Email', width: 300 },
  ]
  const getRecord = () => {
    let items = []
    categories.forEach((item) => {
      // console.log(item)
      let record = {
        id: item.email,
        email: item.email,
        category: item.category_id,
      }
      items.push(record)
    })

    return items
  }
  const paginationModel = { page: 0, pageSize: 5 }
  const handleSelectionChange = (selection) => {
    setSelectedOptions(selection)
  }
  const handleModelChange = (e) => {
    setSate({ ...state, message: e })
  }
  const createForm = () => {
    return (
      <>
        <CModal
          size="xl"
          visible={visibleXL}
          onClose={() => setVisibleXL(false)}
          aria-labelledby="OptionalSizesExample1"
        >
          <CModalHeader>
            <CModalTitle id="OptionalSizesExample1">Select Email</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <DataGrid
              rows={getRecord()}
              slots={{ toolbar: GridToolbar }}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionChange}
              sx={{ border: 0 }}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => setVisibleXL(!visibleXL)}>
              Confirm Email
            </CButton>
          </CModalFooter>
        </CModal>
        <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
          <CCardHeader>
            <strong>{id ? 'Update' : 'Add'} Email</strong>
          </CCardHeader>
          <CForm>
            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInput1" style={{ width: '100%' }}>
                Select Email
              </CFormLabel>

              <CButton color="primary" onClick={() => setVisibleXL(!visibleXL)}>
                Select Emails
              </CButton>
              <p style={{ color: 'red' }}>{!state.categoryId ? error : ''}</p>
            </div>
            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInput1">Name</CFormLabel>
              <CFormInput
                type="text"
                id="exampleFormControlInput1"
                name="subject"
                value={state.subject}
                onChange={(e) => setSate({ ...state, subject: e.target.value })}
                placeholder="Subject"
              />
              <p style={{ color: 'red' }}>{!state.subject ? error : ''}</p>
            </div>

            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInput1">Address</CFormLabel>
              {/* <CFormTextarea
                type="text"
                id="exampleFormControlInput1"
                name="message"
                value={state.message}
                onChange={(e) => setSate({ ...state, message: e.target.value })}
                placeholder="Add Email Message"
              /> */}
              <FroalaEditor
                tag="textarea"
                config={{
                  placeholderText: 'Add Email Message!',
                  charCounterCount: false,
                }}
                model={state.message}
                onModelChange={handleModelChange}
              />
              {/* <p style={{ color: 'red' }}>{!state.address ? error : ''}</p> */}
            </div>
            <div className="m-3">
              <div className="d-grid gap-2 col-6 mx-auto">
                <CButton color="primary" style={{ marginTop: '4%' }} onClick={() => saveDate()}>
                  {loading === true ?? <Spinner as="span" animation="grow" />}
                  {loading ? ' ...Saving Record' : id ? 'Update' : 'Submit'}
                </CButton>
              </div>
            </div>
          </CForm>
        </CCard>
      </>
    )
  }
  return (
    <CRow>
      <CCol xs={12}>{createForm()}</CCol>
    </CRow>
  )
}

export default SendEmail
