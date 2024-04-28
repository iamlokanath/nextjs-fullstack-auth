import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'
export const sendEmail = async({email, emailType, userId}) =>
{
    try{
      const hashedToken = await bcryptjs.hash(userId.toString(), 10)
      //TODo: configure mail for usage
      if(emailTpye === "VERIFY"){
        await User.findByIdAndUpdate(userId,
          {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000}
        )
      } else if(emailTpye === "RESET"){
        await User.findByIdAndUpdate(userId,
          {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}
        )

      }


      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "49bef840bb572d", //need to change
          pass: "52ef0a97ffbecd" //need to change
        }
      });

          const mailOptions = {
            from: 'lokanathpanda128@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify Your Email" : "Reset Your Password", // Subject line
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyenail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "reset your password"} 
            or copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, 
          }
          const mailResponse = await transporter.sendMail(mailOptions);
          return mailResponse


    }catch(error:any){
        throw new Error(error.message)

    }
}