'use strict'
require('dotenv').config()
const express    = require('express')
const bodyParser = require('body-parser')
const sendgrid   = require('sendgrid')(process.env.SENDGRID_APIKEY)

const mail = () => {
  /**
   * @param  {Object} sender  sender.name sender.email
   * @param  {String} subject
   * @param  {String} text
   */
  function sendMail(sender, subject, text) {
    const email = new sendgrid.Email()

    email.addTo(process.env.MAIL_TO)
    email.setFrom(sender.email)
    email.setSubject(subject)
    email.setHtml(text)

    return new Promise((resolve, reject) => {
      sendgrid.send(email, (err, json) => {
        if (err) return reject(err)
        sendCopy(sender, subject, text)
        resolve(json)
      })
    })
  }

  function sendCopy(sender, subject, text) {
    const email = new sendgrid.Email()

    email.addTo(sender.email)
    email.setFrom(process.env.MAIL_TO)
    email.setSubject(`Copia de correo: ${subject}`)

    const html = `<strong>Gracias por escribirnos. Nos pondremos en contacto de inmediato!</strong>
                 <br><br>
                 ${text}`
    email.setHtml(html)

    return new Promise((resolve, reject) => {
      sendgrid.send(email, (err, json) => {
        if (err) return reject(err)
        resolve(json)
      })
    })
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
    .then(() => res.redirect('/#mailSent'))
    .catch(console.log)
})

app.listen(process.env.PORT || 8080)
