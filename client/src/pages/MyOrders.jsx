import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import NoData from '../components/NoData';

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order);
  const itemsPerPage = 5; // Number of orders per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>Orders</h1>
      </div>

      {!orders.length ? <NoData /> : (
        <>
          {paginatedOrders.map((order, index) => (
            <div key={order._id + index + "order"} className="border rounded p-4 text-sm">
              <p>Order No: {order?.orderId}</p>
              <div className="flex gap-3">
                <img src={order.product_details.image[0]} className="w-14 h-14" alt="Product" />
                <p className="font-medium">{order.product_details.name}</p>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-primary-200 hover:bg-primary-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-medium">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-primary-200  hover:bg-primary-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;

// import React from 'react'
// import { useSelector } from 'react-redux'
// import NoData from '../components/NoData'

// const MyOrders = () => {
//   const orders = useSelector(state => state.orders.order)

//   console.log("order Items",orders)
//   return (
//     <div>
//       <div className='bg-white shadow-md p-3 font-semibold'>
//         <h1>Order</h1>
//       </div>
//         {
//           !orders[0] && (
//             <NoData/>
//           )
//         }
//         {
//           orders.map((order,index)=>{
//             return(
//               <div key={order._id+index+"order"} className='order rounded p-4 text-sm'>
//                   <p>Order No : {order?.orderId}</p>
//                   <div className='flex gap-3'>
//                     <img
//                       src={order.product_details.image[0]} 
//                       className='w-14 h-14'
//                     />  
//                     <p className='font-medium'>{order.product_details.name}</p>
//                   </div>
//               </div>
//             )
//           })
//         }
//     </div>
//   )
// }

// export default MyOrders