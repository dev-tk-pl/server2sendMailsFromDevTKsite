const cors = require('cors');
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 3000;

/** Decode Form URL Encoded data */
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// nodemailer - start
function wyslijMaila(textFromForm) {
  let formData = JSON.parse(textFromForm)
  console.log(formData.name);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let helperOption = {
    from: 'stefan',
    to: process.env.MAIL,
    subject: `Wiadomośći od ${formData.name}`,
    text: `Wiadomość od: ${formData.name} \nTreść wiadomości: ${formData.message} \n \nMail: ${formData.email}`
  }

  transporter.sendMail(helperOption, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('message sent :)');
    console.log(info);
  })
}

// nodemailer - end

/** Process POST request */
app.post('/api', function (req, res, next) {
  let textFromForm = JSON.stringify(req.body)
  res.send(textFromForm);
  wyslijMaila(textFromForm)
  console.log(req.body)
});

/** Run the app */
app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);