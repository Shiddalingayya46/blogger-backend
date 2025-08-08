const bcrypt = require('bcrypt');
const User = require('../models/User');

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user with hashed password
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Avoid returning password in response
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(201).json(userWithoutPassword);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: `user not found with email ${email}` })

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        console.log(typeof (user._id))

        return res.status(200).json({ message: "success", userDetails: { userId: user._id, email: user.email } })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    createUser,
    getAllUsers,
    deleteUser,
    login
};
