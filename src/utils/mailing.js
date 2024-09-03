import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 's.giraldo517@gmail.com',
        pass: 'wzyu ulvo yhhf jghn'
    }
})