import { createSlice } from "@reduxjs/toolkit";

const initialvalue = {
    addressList : []
}

const addressSlice = createSlice({
    name: 'address',
    initialState : initialvalue,
    reducers : {
        handleAddAddress : (state,action)=>{
            state.addressList = [...action.payload]
        }
    }
})

export const { handleAddAddress } = addressSlice.actions

export default addressSlice.reducer