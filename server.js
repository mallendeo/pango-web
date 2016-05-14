'use strict'
require('dotenv').config()
const nodemailer = require('nodemailer')
const express    = require('express')
const bodyParser = require('body-parser')

const mail = () => {
  const credentials = `smtps://${process.env.GMAIL_USER}:${process.env.GMAIL_PASSWORD}@smtp.gmail.com`
  const transporter = nodemailer.createTransport(credentials)

  /**
   * @param  {Object} sender  sender.name sender.email
   * @param  {String} subject
   * @param  {String} text
   */
  function sendMail(sender, subject, text) {
    let mailOptions = {
      from    : `"${sender.name}" <${sender.email}>`,
      replyTo : sender.email,
      to      : process.env.GMAIL_USER,
      subject : subject,
      text    : text,
      html    : text
    }

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
          return reject(error)
        }
        sendCopy(sender, subject, text)
        resolve(info.response)
      })
    })
  }

  function sendCopy(sender, subject, text) {
    let copy = {
      from    : `"Pango Interactive" <${process.env.GMAIL_USER}>`,
      to      : sender.email,
      subject : `Copia de correo: ${subject}`,
      text    : `Gracias por escribirnos. Nos pondremos en contacto de inmediato! \n ${text}`,
      html    : `<strong>Gracias por escribirnos. Nos pondremos en contacto de inmediato!</strong>
                 <br>
                 ${text}`
    }
    transporter.sendMail(copy)
  }

  return {
    sendMail
  }
}


let app    = express()
let mailer = mail()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('dist'))

app.post('/sendMail', (req, res) => {
  mailer.sendMail({
      name: req.body.name,
      email: req.body.email
    },
    req.body.subject,
    req.body.text)
    .then(() => res.sendStatus(200))
    .catch(console.log)
})

app.listen(process.env.PORT || 8080)
