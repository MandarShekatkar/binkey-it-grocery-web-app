import React, {useEffect,useState} from "react"

const useMobile=(breakpoint = 768)=>{
    const [isMobile,setIsmobile]= useState(window.innerWidth < breakpoint)

    const handleResize =()=>{
        const chekpoint = window.innerWidth < breakpoint
        setIsmobile(chekpoint)
    }

    useEffect(()=>{
        handleResize()

        window.addEventListener('resize',handleResize)

        return ()=>{
            window.removeEventListener('resize', handleResize)
        }
    },[])
    return[isMobile]
}

export default useMobile