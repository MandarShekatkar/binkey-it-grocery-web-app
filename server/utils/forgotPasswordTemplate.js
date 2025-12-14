const forgotPasswordTemplate = ({name, otp}) =>{
    return `
   <div>
   <p>Dear ${name}</p>
   <p>You're requested to a password reset. 
   Please use following OTP code to
   reset your password.</p>

   <div style="background:yellow;font-size:20px;padding:20px;
   text-align:center;font-weight:800;">
   ${otp}
   </div>

   <p>This OTP is valid for only 1 hour only.
   enter this OTP in the binkeyit website to 
   procees with the resetting your password. 
   </p>
   <br/>
   </br>
   <p>Thanks</p>
   <p>Binkeyit</p>
   </div>
    `
}

export default forgotPasswordTemplate