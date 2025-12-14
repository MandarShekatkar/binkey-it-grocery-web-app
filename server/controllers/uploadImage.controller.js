import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"

const UploadImageController = async(request,response)=>{
    try {
        const file = request.file

        const uploadImage = await uploadImageCloudinary(file)

        return response.json({
            message:"Upload Done",
            data: uploadImage,
            success:true,
            success:false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error:false,
            success: false 
        })
    }
}

export default UploadImageController