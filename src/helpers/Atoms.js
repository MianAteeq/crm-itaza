// eslint-disable-next-line prettier/prettier
import { atom, selector } from 'recoil'

// eslint-disable-next-line prettier/prettier
export const contactState = atom({
  key: 'contactState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
})
export const internetState = atom({
  key: 'internetState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
})
