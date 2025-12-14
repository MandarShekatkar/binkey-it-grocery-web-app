import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart :[]

}

const cartSlice = createSlice({
    name: "cartItem",
    initialState : initialState,
    reducers:{
        handleAddItemCart :  (state,action)=>{
            state.cart = [...action.payload]
        },
    }
})

export const { handleAddItemCart } = cartSlice.actions

export default cartSlice.reducer

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   cart: [],
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     handleAddItemCart: (state, action) => {
//       state.cart = action.payload;
//     },
//     clearCart: (state) => {
//       state.cart = []; // Add clear cart functionality
//     },
//   },
// });

// export const { handleAddItemCart, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;
