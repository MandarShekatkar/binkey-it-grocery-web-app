import React, { useEffect, useState } from 'react';
import Axios from './../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { Link, useParams } from 'react-router-dom';
import AxiosToastError from './../utils/AxiosToastError';
import Loading from './../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { validURLConvert } from '../utils/valideURLCovert';


const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCategory,setDisplaySubCategory] = useState([])
  console.log(AllSubCategory);
  

  const subCategory = params?.subcategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subcategory.split("-").slice(-1)[0];

  const fetchProductData = async () => {
    // Check if params.subcategory exists before splitting
    if (!params.category || !params.subcategory) {
      console.error("category or subcategory is missing in params");
      return;
    }
   try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId, // Fix key name
          page: page,
          limit: 8
        }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.page === 1 ? responseData.data : [...data, ...responseData.data]);
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params]);

  useEffect(() => {
    const sub = AllSubCategory.filter(s=> {
    const filterData = s.category.some(el => {
      return el._id === categoryId
    })
    return filterData ? filterData : null
  })
  setDisplaySubCategory(sub)
},[params,AllSubCategory])

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/* Sub category */}
        <div className="min-h-[88vh] max-h-[88vh] overflow-y-scroll gap-1 grid shadow-md scrollbarCustom bg-white py-2">
          {
            DisplaySubCategory.map((s,index)=>{
            const link = `/${validURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validURLConvert(s.name)}-${s._id}`
              return(
                <Link to={link} className={`w-full p-2
                lg:flex items-center 
                lg:w-full lg:h-16 box-border 
                lg:gap-4 border-b hover:bg-green-100 cursor-pointer

                 ${subCategoryId === s._id ? "bg-green-100" : ""}
                 
                 `}>
                  <div className='w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded box-border'> 
                    <img 
                      src={s.image}
                      alt='subCategory'
                      className='w-14 lg:h-14 lg:w-12 h-full object-scale-down'
                    />
                  </div>
                  <p className=' -mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>

        {/* Product */}
        <div className="sticky top-20">
          <div className="bg-white shadow-md p-4 z-10">
            {/* Display subcategory name */}
            <h3 className='font-semibold'>{subCategoryName}</h3>
          </div>
          <div>
              <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4'>
                {
                  data.map((p,index)=>{
                    return(
                      <CardProduct 
                      data={p}
                      key={p._id+"productSubCategory"+index}
                      />
                    )
                  })
                }
              </div>
              </div>
            {
              loading && (
                <Loading />
              )
            }

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;

// import React, { useEffect, useState } from 'react'
// import Axios from './../utils/Axios';
// import SummaryApi from '../common/SummaryApi';
// import { useParams } from 'react-router-dom';
// import AxiosToastError from './../utils/AxiosToastError';
// const ProductListPage = () => {
// const [data,setData] = useState([])
// const [page,setPage] = useState(1)
// const [loading,setLoading] = useState(false)
// const [totalPage,setTotalpage] = useState(1)
// const params = useParams()

// const fetchProductData = async()=>{

//   const categoryId = params.category.split("-").slice(-1)[0]
//   const subCategoryId = params.subCategory.split("-").slice(-1)[0]
  
  
//   try {
//     setLoading(true)
//     const response = await Axios({
//       ...SummaryApi.getProductByCategoryAndSubCategory,
//       data:{
//         categoryId:categoryId,
//         subCategory:subCategoryId,
//         page : page,
//         limit: 10
//       }
//     })
//     const {data : responseData} =response

//     if(responseData.success){
//       if(responseData.page == 1){
//         setData(responseData.data)
//       }else{
//         setData([...data,...responseData.data])
//       }
//   setTotalpage(responseData.totalCount)
    
//     }
//   } catch (error) {
//     AxiosToastError(error)
//   }finally{
//     setLoading(false)
//   }
// }




// useEffect(()=>{
//  fetchProductData()
// },[params])

//   return (
//   <section className='sticky top-24 lg:top-20'>
//     <div className='container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]'>
//       {/* Sub category */}
//       <div className='bg-red-500 min-h-[79vh]'>
//       Sub category
//       </div>

//       {/* product */}
//       <div className=''>
//       <div className='bg-white shadow-md p-2'>
//         <h3>{params.subCategory}</h3>
//         </div>
//         </div>

//     </div>
//   </section>
//   )
// }

// export default ProductListPage
