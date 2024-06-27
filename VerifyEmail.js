// // EmailVerify.js

const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Add the React app's origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.options('*', cors()); // Enable pre-flight requests for all routes

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Function to generate a secure token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Temporary store for verification tokens (in-memory for demonstration)
const verificationTokens = {};
const verifiedEmails = {}; // Store verified emails

// Route to send verification email
app.post('/send-verification-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is required.');
  }

  const verificationToken = generateToken();
  verificationTokens[email] = verificationToken;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the link: http://localhost:${PORT}/verify-email?token=${verificationToken}&email=${email}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).send(`Error sending verification email: ${error.message}`);
  }
});

// Route to verify email
app.get('/verify-email', (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).send('Token and email are required.');
  }

  if (verificationTokens[email] && verificationTokens[email] === token) {
    delete verificationTokens[email];
    verifiedEmails[email] = true;
    res.status(200).send('Email verified successfully');
  } else {
    res.status(400).send('Invalid verification token or email');
  }
});

// Route to handle file uploads
app.post('/upload-file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  res.send({
    fileName: req.file.filename,
    fileSize: req.file.size
  });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



// const express = require('express');
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const fs = require('fs');
// const crypto = require('crypto');
// const bodyParser = require('body-parser');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:3000'], // Add the React app's origin
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// app.use(express.json());
// app.use(bodyParser.json());
// app.options('*', cors()); // Enable pre-flight requests for all routes

// // Ensure the uploads directory exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Set storage engine for multer
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (_req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });
// const upload = multer({ storage });

// // Function to generate a secure token
// const generateToken = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

// // Temporary store for verification tokens (in-memory for demonstration)
// const verificationTokens = {};
// const verifiedEmails = {}; // Store verified emails

// // Route to send verification email
// app.post('/send-verification-email', async (req, res) => {
//   const { email } = req.body;
//   if (!email) {
//     return res.status(400).send('Email is required.');
//   }
//   const verificationToken = generateToken();
//   verificationTokens[email] = verificationToken;

//   const transporter = nodemailer.createTransport({
//     // host: 'smtp.gmail.com',
//     // port: 587,
//     // secure: true,
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     // tls: {
//     //   rejectUnauthorized: false,
//     // },
//     // logger: true,
//     // debug: true,
//     // timeout: 60000, // 60 seconds timeout
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Email Verification',
//     text: `Please verify your email by clicking the link: http://localhost:${PORT}/verify-email?token=${verificationToken}&email=${email}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send('Verification email sent');
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     res.status(500).send(`Error sending verification email: ${error.message}`);
//   }
// });

// // Route to verify email
// app.get('/verify-email', (req, res) => {
//   const { token, email } = req.query;
//   if (!token || !email) {
//     return res.status(400).send('Token and email are required.');
//   }

//   if (verificationTokens[email] && verificationTokens[email] === token) {
//     delete verificationTokens[email];
//     verifiedEmails[email] = true;
//     res.status(200).send('Email verified successfully');
//   } else {
//     res.status(400).send('Invalid verification token or email');
//   }
// });

// // Route to handle file uploads
// app.post('/upload-file', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   res.send({
//     fileName: req.file.filename,
//     fileSize: req.file.size
//   });
// });

// // Error handling middleware
// app.use((err, _req, res, _next) => {
//   console.error(err.stack);
//   res.status(500).send('Internal Server Error');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });




// const express = require('express');
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const fs = require('fs');
// const crypto = require('crypto');
// const bodyParser = require('body-parser');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:3000'],
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// app.use(express.json());
// app.use(bodyParser.json());
// app.options('*', cors());

// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (_req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });
// const upload = multer({ storage });

// const generateToken = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

// const verificationTokens = {};
// const verifiedEmails = {};

// app.post('/send-verification-email', async (req, res) => {
//   const { email } = req.body;
//   // console.log(email)
//   if (!email) {
//     return res.status(400).send('Email is required.');
//   }

//   const verificationToken = generateToken();
//   verificationTokens[email] = verificationToken;

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: {
//       ciphers: 'TLSv1.2',
//     },
//     logger: true,
//     debug: true,
//   });
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Email Verification',
//     text: `Please verify your email by clicking the link: http://localhost:${PORT}/verify-email?token=${verificationToken}&email=${email}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send('Verification email sent');
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     res.status(500).send(`Error sending verification email: ${error.message}`);
//   }
// });

// app.get('/verify-email', (req, res) => {
//   const { token, email } = req.query;
//   if (!token || !email) {
//     return res.status(400).send('Token and email are required.');
//   }

//   if (verificationTokens[email] && verificationTokens[email] === token) {
//     delete verificationTokens[email];
//     verifiedEmails[email] = true;
//     res.status(200).send('Email verified successfully');
//   } else {
//     res.status(400).send('Invalid verification token or email');
//   }
// });

// app.post('/upload-file', upload.single('file'), (req, res) => {
//   console.log('Received file upload request:', req.file);
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   res.send({
//     fileName: req.file.filename,
//     fileSize: req.file.size
//   });
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send(`Internal Server Error: ${err.message}`);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// const express = require('express');
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const fs = require('fs');
// const crypto = require('crypto');
// const bodyParser = require('body-parser');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:3000'], // Add the React app's origin
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// app.use(express.json());
// app.use(bodyParser.json());
// app.options('*', cors()); // Enable pre-flight requests for all routes

// // Ensure the uploads directory exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Set storage engine for multer
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (_req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });
// const upload = multer({ storage });

// // Function to generate a secure token
// const generateToken = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

// // Temporary store for verification tokens (in-memory for demonstration)
// const verificationTokens = {};
// const verifiedEmails = {}; // Store verified emails

// // Route to send verification email
// app.post('/send-verification-email', async (req, res) => {
//   const { email } = req.body;
//   if (!email) {
//     return res.status(400).send('Email is required.');
//   }

//   const verificationToken = generateToken();
//   verificationTokens[email] = verificationToken;

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Email Verification',
//     text: `Please verify your email by clicking the link: http://localhost:${PORT}/verify-email?token=${verificationToken}&email=${email}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send('Verification email sent');
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     res.status(500).send(`Error sending verification email: ${error.message}`);
//   }
// });

// // Route to verify email
// app.get('/verify-email', (req, res) => {
//   const { token, email } = req.query;
//   if (!token || !email) {
//     return res.status(400).send('Token and email are required.');
//   }

//   if (verificationTokens[email] && verificationTokens[email] === token) {
//     delete verificationTokens[email];
//     verifiedEmails[email] = true;
//     res.status(200).send('Email verified successfully');
//   } else {
//     res.status(400).send('Invalid verification token or email');
//   }
// });

// // Route to handle file uploads
// app.post('/upload-file', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   res.send({
//     fileName: req.file.filename,
//     fileSize: req.file.size
//   });
// });

// // Route to submit product details
// app.post('/submit-product', (req, res) => {
//   const { name, instituteName, workingDomain, purpose, variant, date, email, idProofFile } = req.body;

//   // Verify email before proceeding
//   if (!verifiedEmails[email]) {
//     return res.status(400).send('Email not verified.');
//   }

//   // Here you would typically save the product details to your database
//   // This is a mock implementation

//   console.log('Product details:', {
//     name,
//     instituteName,
//     workingDomain,
//     purpose,
//     variant,
//     date,
//     email,
//     idProofFile,
//   });

//   res.status(200).send('Product added successfully');
// });

// // Error handling middleware
// app.use((err, _req, res, _next) => {
//   console.error(err.stack);
//   res.status(500).send('Internal Server Error');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

