// import jwt from 'jsonwebtoken';

// const auth = async (request, response, next) => {
//     try {
//         const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

//         if (!token) {
//             return response.status(401).json({
//                 message: "Authentication required. Please login.",
//                 error: true,
//                 success: false
//             });
//         }

//         const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        
//         request.userId = decode.id; // Attach userId to request for further use
//         next();

//     } catch (error) {
//         let errorMessage = "Authentication error. Please login again.";
        
//         if (error.name === "TokenExpiredError") {
//             errorMessage = "Session expired. Please login again.";
//         } else if (error.name === "JsonWebTokenError") {
//             errorMessage = "Invalid token. Please login again.";
//         }

//         return response.status(401).json({
//             message: errorMessage,
//             error: true,
//             success: false
//         });
//     }
// };

// export default auth;


import jwt from 'jsonwebtoken'

const auth = async(request,response,next)=>{
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
       
        if(!token){
            return response.status(401).json({
                message : "Provide token"
            })
        }

        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)

        if(!decode){
            return response.status(401).json({
                message : "unauthorized access",
                error : true,
                success : false
            })
        }

        request.userId = decode.id

        next()

    } catch (error) {
        return response.status(500).json({
            message : "You have not login",///error.message || error,
            error : true,
            success : false
        })
    }
}

export default auth


// // import jwt from 'jsonwebtoken'

// // const auth = async(request,response,next)=>{
// //     try{
// //         const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1] 
        
// //         if(!token){
// //             return response.status(401).json({
// //                 message: "Provide token"
// //             })
// //         }

// //         const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
        
// //         if(!decode){
// //             return response.status(401).json({
// //                 message: "unauthorized access",
// //                 error:true,
// //                 success:false
// //             })
// //         }

// //         request.userId = decode.id

// //         next()

// //     }catch(error){
// //         return response.status(500).json({
// //             message: "You Have Not Login" ,//error.message || error,
// //             error: true,
// //             success:false
// //         })
// //     }
// // }

// // export default auth

// import jwt from 'jsonwebtoken';

// const auth = async (request, response, next) => {
//     try {
//         const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

//         if (!token) {
//             return response.status(401).json({
//                 message: "Authentication required. Please login.",
//                 error: true,
//                 success: false
//             });
//         }

//         const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        
//         if (!decode) {
//             return response.status(401).json({
//                 message: "Invalid token. Please login again.",
//                 error: true,
//                 success: false
//             });
//         }

//         request.userId = decode.id;
//         next();

//     } catch (error) {
//         let errorMessage = "Authentication error. Please login again.";
        
//         if (error.name === "TokenExpiredError") {
//             errorMessage = "Session expired. Please login again.";
//         } else if (error.name === "JsonWebTokenError") {
//             errorMessage = "Invalid token. Please login again.";
//         }

//         return response.status(401).json({
//             message: errorMessage,
//             error: true,
//             success: false
//         });
//     }
// };

// export default auth;

// import jwt from 'jsonwebtoken';

// const auth = async (request, response, next) => {
//     try {
//         const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

//         if (!token) {
//             return response.status(401).json({
//                 message: "NoToken", // Custom message to indicate missing token
//                 error: true,
//                 success: false
//             });
//         }

//         const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        
//         if (!decode) {
//             return response.status(401).json({
//                 message: "InvalidToken", // Custom message for frontend handling
//                 error: true,
//                 success: false
//             });
//         }

//         request.userId = decode.id;
//         next();

//     } catch (error) {
//         let errorMessage = "AuthError"; // Default response for silent handling
        
//         if (error.name === "TokenExpiredError") {
//             errorMessage = "TokenExpired";
//         } else if (error.name === "JsonWebTokenError") {
//             errorMessage = "InvalidToken";
//         }

//         return response.status(401).json({
//             message: errorMessage,
//             error: true,
//             success: false
//         });
//     }
// };

// export default auth;


