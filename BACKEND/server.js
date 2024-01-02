const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); 
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  // Your subscription logic here...

  // Send a confirmation email
  try {
    const transporter = nodemailer.createTransport({
      // Specify your email service provider's configuration here
      service: 'gmail',
      auth: {
        user: 'skandabhebbar@gmail.com',
        pass: 'krcs mils vsam lglj',
      },
    });

    const mailOptions = {
      from: 'skandahebbar@gmail.com',
      to: email,
      subject: 'Subscription Confirmation',
      text: 'Thank you for subscribing to our company!',
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent: Subscription confirmation');

    // Send a response to the client
    res.status(200).json({ message: 'Subscription successful!', email });
  } catch (error) {
    console.error('Error sending confirmation email:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
