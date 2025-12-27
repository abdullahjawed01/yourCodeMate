import mailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

async function sendEmail(to,body,text) {
    try {
        let user = process.env.email 
        let pass = process.env.Appass

        let send =  mailer.createTransport({
            service:"gmail",
            auth:{
                user,
                pass,
            }
        })

        let sender = await send.sendMail({
            from:user,
            to,
            body,
            text
        })
        console.log("The email has been sent to ",to,sender.response);


    } catch (error) {
        console.log(error);
    }
}
export default sendEmail