import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from './../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import ProductCardAdmin from '../components/ProductCardAdmin';
import { IoIosSearch } from "react-icons/io";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch product data based on page and search
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search,
        },
      });

      const { data: responseData } = response;

      // If the response is successful, update the state
      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage); // Use the correct field here
        setProductData(responseData.data);
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch data whenever page changes
  useEffect(() => {
    fetchProductData();
  }, [page]); // Only runs when the page changes

  // Handle the next button
  const handleNext = () => {
    if (page < totalPageCount) {
      setPage((prev) => prev + 1); // Increment page
    }
  };

  // Handle the previous button
  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1); // Decrement page
    }
  };

  // Handle the search input change
  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1); // Reset to page 1 when searching
  };



  // Trigger search after a delay to reduce API calls
  useEffect(() => {
    let flag = true;
    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false; // Make sure the call only happens once
      }
    }, 300);

    return () => {
      clearTimeout(interval);
    };
  }, [search]); // Triggered when search text changes

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between gap-4'>
        <h2 className='font-semibold'>Product</h2>
        <div className='h-full w-full ml-auto min-w-24 max-w-56 bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200'>
          <IoIosSearch size={20} />
          <input
            type='text'
            placeholder='Search Product Here...'
            className='h-full w-full outline-none bg-transparent'
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {loading && <Loading />}

      <div className='p-4 bg-blue-50'>
        <div className='min-h-[55vh]'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {productData.map((p, index) => (
              <ProductCardAdmin key={index} data={p} fetchProductData={fetchProductData} />
            ))}
          </div>
        </div>

        <div className='flex justify-between my-2'>
          <button
            onClick={handlePrevious}
            className='border border-primary-200 px-4 py-1 hover:bg-primary-100'
          >
            Previous
          </button>
          <button className='w-full bg-slate-100'>
            {page}/{totalPageCount}
          </button>
          <button
            onClick={handleNext}
            className='border border-primary-200 px-4 py-1 hover:bg-primary-100'
          >
            Next
          </button>
        </div>
      </div>

     
    </section>
  );
};

export default ProductAdmin;



