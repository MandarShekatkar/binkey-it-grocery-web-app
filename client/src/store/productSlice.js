import { createSlice } from '@reduxjs/toolkit';

const initialValue = {
    allCategory : [],
    loadingCategory:false,
    allSubCategory :[],
    product:[]
}

const productSlice = createSlice({
    name: "product",
    initialState : initialValue,
    reducers:{
      setAllCategory :  (state,action)=>{
        
        state.allCategory = [...action.payload]
      },
      seLoadingCategory : (state,action)=>{
        state.loadingCategory =action.payload
      },
      setAllSubCategory : (state,action)=>{
        state.allSubCategory = [...action.payload]
      },
    }

})

export const {setAllSubCategory,setAllCategory,seLoadingCategory} = productSlice.actions

export default productSlice.reducer