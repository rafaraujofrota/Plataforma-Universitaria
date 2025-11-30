import nodemailer from "nodemailer"

const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_ADRESS,
        pass: process.env.MAIL_PASS,
    },
});

export default mailer