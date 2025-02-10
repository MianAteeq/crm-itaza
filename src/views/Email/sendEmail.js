import React, { useRef } from 'react'
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
import { savedLogs, showErrorMessage, showSuccessMessage } from '../../helpers/helper'
import Select from 'react-select'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
))
const client = generateClient()
const SendEmail = () => {
  const [categories, setCategory] = useState([])
  const [companyList, setCompanyList] = useState([
    { label: 'IADSR', value: 'IADSR' },
    { label: 'Dental Services', value: 'Dental Services' },
    { label: 'Fission Monster', value: 'Fission Monster' },
  ])
  const [emailList, setEmailList] = useState([])
  const [state, setSate] = useState({
    emails: [],
    company: '',
    batch: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [showHospital, setShowHospital] = useState(false)
  const [id, setID] = useState('')
  const [error, setError] = useState('')
  const [selectedOptions, setSelectedOptions] = useState([])
  const [visibleXL, setVisibleXL] = useState(false)
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
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
    let EmailArray = []
    let records = JSON.parse(localStorage.getItem('cats')).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    console.log(records)

    records.forEach((item, j) => {
      const chunkSize = 1000
      let catValue = categories.filter((rec) => rec.category_id === item.name)
      let no = 0
      for (let i = 0; i < catValue.length; i += chunkSize) {
        no++
        console.log(catValue.length, item.name)
        const chunk = catValue.slice(i, i + chunkSize)
        let obj = {
          value: `${item.name} Batch ${no}`,
          label: `${item.name} Batch ${no}`,
          emails: chunk,
        }
        EmailArray.push(obj)
      }
    })
    setEmailList(EmailArray)
    console.log(EmailArray, 'EmailArray')
  }, [categories])

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

  const updateState = () => {
    setSate({
      emails: [],
      company: '',
      batch: '',
      subject: '',
      message: '',
    })
  }

  const saveDate = async () => {
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
      file: file,
    }
    // obj.emails = selectedOptions
    updateState()
    try {
      const sentWeatherData = await axios
        .post('https://cms.fissionmonster.com/api/send', obj)
        .then(async (response) => {
          if (response.data.status === true) {
            setSelectedOptions([])
            setLoading(false)
            showSuccessMessage('Email Send Successfully!')
            let object = {
              message: `Send Email to ${obj.batch}`,
            }

            await savedLogs('SEND EMAIL', object)

            updateState()
          }

          if (response.data.status === false) {
            // setSelectedOptions([])
            setLoading(false)
            showSuccessMessage(response.data.message)
          }
        })
    } catch {
      console.log('error')
      setLoading(false)
      showErrorMessage('Email Not Send!')
    }
  }
  const onChangeCompany = (e) => {
    // let email = e.clipboardData.getData('Text')

    setSate({
      ...state,
      company: e.value,
    })
  }

  const onChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions.emails)
    console.log(selectedOptions.value)
    setSate({
      ...state,
      batch: selectedOptions.label,
    })
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
  const handleFileChange = (e) => {
    if (e.target.files) {
      // setFile(e.target.files[0])
      convertToBase64(e.target.files[0])
    }
  }
  const convertToBase64 = (selectedFile) => {
    const reader = new FileReader()

    reader.readAsDataURL(selectedFile)

    reader.onload = () => {
      console.log('called: ', reader.result)
      setFile(reader.result)
    }
  }
  const createForm = () => {
    return (
      <>
        <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
          <CCardHeader>
            <strong>Send Email</strong>
          </CCardHeader>
          <CForm>
            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInputCompany" style={{ width: '100%' }}>
                Select Company
              </CFormLabel>
              <Select
                onChange={onChangeCompany}
                value={{ label: state.company }}
                options={companyList}
              />
              <p style={{ color: 'red' }}>{!state.company ? error : ''}</p>
            </div>
            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInputBatch" style={{ width: '100%' }}>
                Select Email Batch
              </CFormLabel>
              <Select onChange={onChange} value={{ label: state.batch }} options={emailList} />
              <p style={{ color: 'red' }}>{!state.batch ? error : ''}</p>
            </div>
            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInputsubject">Subject</CFormLabel>
              <CFormInput
                type="text"
                id="exampleFormControlInputsubject"
                name="subject"
                value={state.subject}
                onChange={(e) => setSate({ ...state, subject: e.target.value })}
                placeholder="Subject"
              />
              <p style={{ color: 'red' }}>{!state.subject ? error : ''}</p>
            </div>
            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInput1">Add File</CFormLabel>
              <CFormInput
                type="file"
                id="exampleFormControlInput1"
                name="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                placeholder="Add File"
              />
              {/* <p style={{ color: 'red' }}>{!state.address ? error : ''}</p> */}
            </div>

            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInput1">Message</CFormLabel>
              <ReactQuill theme="snow" value={state.message} onChange={handleModelChange} />
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
