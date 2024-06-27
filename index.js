// app.js
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Connect to MySQL database
const sequelize = new Sequelize('shavak', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

// Sync models with database schema (for development/testing)
sequelize.sync().then(() => {
    console.log('Database synchronized with models.');
  }).catch(error => {
    console.error('Error synchronizing database:', error);
  });
  

// Define User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instituteName: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other')
    },
    dob: {
        type: DataTypes.DATE
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
       
    },
    contactNumber: {
        type: DataTypes.STRING
    },
    
    userId: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    pincode: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    }
});

// Test the database connection
async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testDatabaseConnection();

// Middleware to parse JSON body
app.use(express.json());
// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173'
}));


// Route to handle POST request for user registration
app.post('/users', async (req, res) => {
    const userData = req.body;
    try {
        // Create a new user in the database
        const user = await User.create(userData);
        console.log('User created:', user.toJSON());
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});


// Route to handle GET request for fetching user data
app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // Fetch user data from the database based on userId
        const user = await User.findOne({ where: { userId: userId } }); // Specify the column name 'userId'
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User found:', user.toJSON());
        res.status(200).json(user.toJSON());
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Route to handle user login
// Route to handle user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user with the provided email
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the password stored in the database
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // If the email and password are correct, return a success message
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

