import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../../../server/utils/isAdmin'

const AdminPermission = ({children}) => {
  const user = useSelector(state => state.user)
  
    return (
    <>
    {
        isAdmin(user.role) ? children : <p className='text-red-600 bg-red-100 p-4'>Do Not Have Permission</p>
    }
    
    </>
  )
}

export default AdminPermission
