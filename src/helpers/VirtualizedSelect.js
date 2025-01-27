/* eslint-disable react/prop-types */
import React from 'react'
import Select from 'react-select'
import { FixedSizeList as List } from 'react-window'

// Virtualized option component
const VirtualizedSelect = ({ options, onChange, value }) => {
  const Row = ({ index, style }) => {
    const option = options[index]
    return (
      <div style={style}>
        <div onClick={() => onChange(option)}>{option.label}</div>
      </div>
    )
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      // menuIsOpen
      components={{
        MenuList: ({ children, ...props }) => {
          const height = 35 // Set height per item (in pixels)
          const itemCount = children.length
          const itemSize = height

          return (
            <List
              style={{ cursor: 'pointer' }}
              height={200} // Set max height of dropdown
              itemCount={itemCount}
              itemSize={itemSize}
              width={'100%'} // Set width of dropdown
              {...props}
            >
              {Row}
            </List>
          )
        },
      }}
      isMulti
    />
  )
}

export default VirtualizedSelect
