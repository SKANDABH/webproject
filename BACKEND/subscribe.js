const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1/subscribe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is already subscribed
    const existingSubscription = await Subscription.findOne({ email });

    if (existingSubscription) {
      res.status(409).json({ error: 'Already subscribed' });
        console.log("You are already subscribed to our channel.");
    } else {
        // Save the email to the database
        const subscription = new Subscription({ email });
        await subscription.save();
        console.log("Saved successfully in the database.");
        res.status(200).json({ message: 'Subscription successful!', email });
    }
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
    res.status(200).json({ message: 'Subscription successful!', email })
} catch (error) {
    if (error.code === 11000) {
        // Duplicate key error (email already exists)
        res.status(409).json({ error: 'Already subscribed' });
        console.log("You are already subscribed to our channel.");
    } else {
      console.error('Error sending confirmation email:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
   
}});

//     // Send a confirmation email
//     const transporter = nodemailer.createTransport({
//       // Specify your email service provider's configuration here
//       service: 'gmail',
//       auth: {
//         user: 'skandabhebbar@gmail.com',
//         pass: 'krcs mils vsam lglj',
//       },
//     });

//     const mailOptions = {
//       from: 'skandahebbar@gmail.com',
//       to: email,
//       subject: 'Subscription Confirmation',
//       text: 'Thank you for subscribing to company!',
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent: Subscription confirmation');

//     // Send a response to the client
//     res.status(200).json({ message: 'Subscription successful!', email });
//  catch (error) {
//      console.error('Error subscribing:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });   }
//   });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
