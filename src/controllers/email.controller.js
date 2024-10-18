import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { ApiError } from "../utils/ApiError.js";
import dotenv from 'dotenv';
dotenv.config() 
 
 
const sendEmail = (req, res) => {

    const {senderName,senderEmail,query } = req.body;
    if(!senderName || !senderEmail || !query){
      throw new ApiError(400,"All fields are required");
    }
    

    console.log(senderName,senderEmail,query);

    let config = {
        service : 'gmail',
        auth : {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "Mailgen",
            link : 'https://mailgen.js/'
        }
    })

    let response = {
      body: {
          name: "Students' Branding and Relations Cell",  
          intro: "You have received a new query!", // Introductory message
          table: {
              data: [
                  {
                      item: "Sender Name",
                      description:`${senderName}`
                  },
                  {
                      item: "Sender Email",
                      description: `${senderEmail}`, // Example sender email
                  },
                  {
                      item: "Query",
                      description:`${query}`, // Example query
                  }
              ]
          },
          outro: "We will get back to you as soon as possible." 
      }
  };
  
  let mail = MailGenerator.generate(response);
  

    let message = {
        from : process.env.EMAIL,
        to : "vikukm4@gmail.com",
        subject: "New Query",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
 
}


export {sendEmail}