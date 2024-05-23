const User = require('../model/User.Model.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    const {name,email, password } = req.body;
    console.log(req.body);
    try {
        // To encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name:name,
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({
            content: newUser,
            message: "Success!!!",
        });
    } catch (err) {
        res.status(400).json({
            status: "Error",
            content: err,
        });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const checkUser = await User.findOne({ email }).exec();
        console.log(checkUser);
        if (!checkUser) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        const passwordMatch = await bcrypt.compare(password, checkUser.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Incorret password",
            });
        }

        const accessToken = jwt.sign({ _id: checkUser.id, email: checkUser.email }, "My_Secret", {
            expiresIn: "3600s",
        });

        res.cookie("jwt", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            token: accessToken,
            content: "Success!!",
        });

    } catch (err) {
        console.log(err)
        res.status(400).json({
            status: "Error",
            content: err,
        });
    }
};

exports.changeUserPassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "Error",
                content: "User not found",
            });
        }
        if ( !User.password === currentPassword ) {
            return res.status(401).json({
                message: "Incorret password",
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const passwordChanged = await User.findByIdAndUpdate(
            user._id,
            { password: hashedPassword },
            {
                runValidators: true,
                new: true,
            }
        );
        console.log(passwordChanged);
        // console.log(newPassword);
        res.status(200).json({
            status: "Successfully Password Changed",
            content: passwordChanged,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};

exports.logoutUser = async (req, res) => {
    console.log(req.user)
    try {
        const currentUser = req.user;
        if (!currentUser) {
            return res.status(204).json({
                message: "No Active User"
            });
        }
        await res.clearCookie('jwt'); 
        res.status(200).json({
            status: "Success",
            content: "Logout successful",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};
