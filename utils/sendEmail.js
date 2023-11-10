import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

const sendEmail = async function(email , subject , message){
    // creating reusable transporter object using the default SMTP transport

    const transport = nodemailer.createTransport(sendgridTransport({
        auth: {
            api_key: process.env.SMTP_SENDGRID_API_KEY
        }
    }))

    // send mail with defined transport object
    await transport.sendMail({
        from: process.env.SMTP_FROM_EMAIL, // sender address
        to: email, //user email
        subject: subject,
        html: message,
    })
}

export default sendEmail;
