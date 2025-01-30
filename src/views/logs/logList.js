import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import DataTable from 'react-data-table-component'
import { NavLink } from 'react-router-dom'
import { showSuccessMessage } from '../../helpers/helper'
const client = generateClient()
const LogList = () => {
  const [categories, setCategory] = useState([])
  const [name, setName] = useState('')
  const [id, setID] = useState('')
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Log.list()
    setCategory(items)

  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const editRecord = (record) => {
    setVisible(true)
    setID(record.toID)
    setName(record.name)
  }

  const saveDate = async () => {
    if (!name.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }
    if (id !== '') {
      const toBeDeletedTodo = {
        toID: id,
      }

      const { data: deletedTodo, error } = await client.models.Log.delete(toBeDeletedTodo)

      const todo = {
        toID: name,
        name: name,
      }
      const { data: updatedTodo, errors } = await client.models.Log.create(todo)
      if (errors) {
        setError(errors[0].message)
      } else {
        fetchTodos()
        setID('')
        setName('')
        setVisible(false)
      }
    } else {
      const { errors, data: newTodo } = await client.models.Log.create({
        name: name,
        toID: name,
      })
      if (errors) {
        setError(errors[0].message)
      } else {
        fetchTodos()
        setID('')
        setName('')
        setVisible(false)
      }
    }
  }
  const columns = [
    {
      name: 'ID',
      selector: (row, i) => i + 1,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
    },
    {
      name: 'Date',
      selector: (row) => row.date,
    },
    {
      name: 'Time',
      selector: (row) => row.time,
    },
    {
      name: 'LogType',
      selector: (row) => row.logType,
    },
    {
      name: 'Action',
      selector: (row) => {
        return (
          <NavLink to={{ pathname: '/view/log' }} state={JSON.stringify(row)}>
            View
          </NavLink>
        )
      },
    },
  ]

  const getSort = () => {
    console.log(categories)
    if (categories.length > 0) {
      return categories.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
    return []
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Logs</strong>{' '}
          </CCardHeader>
          <CCardBody>
            <div className="overflow-x-auto">
              <DataTable columns={columns} data={getSort()} pagination />
              {/* <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>ID</Table.HeadCell>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {categories.map((item, i) => {
                    return (
                      <>
                        <Table.Row
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          key={item.toID.toString()}
                        >
                          <Table.Cell>{i + 1}</Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-black">
                            {item.name}
                          </Table.Cell>

                          <Table.Cell>
                            <a
                              onClick={() => editRecord(item)}
                              style={{ cursor: 'pointer' }}
                              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                            >
                              Edit
                            </a>
                          </Table.Cell>
                        </Table.Row>
                      </>
                    )
                  })}
                </Table.Body>
              </Table> */}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default LogList
