const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const userRepository = require('../repositories/user.repository');
const env = require('../config/env');
const s3Service = require('./s3.service');

async function registerUser(data) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) { throw new ApiError(409, 'Email Already Registerd'); }

    const passwordHash = await bcrypt.hash(data.password, 10);

    let profilePicture = null;
    if (data.file) {
        profilePicture = await s3Service.uploadFile(data.file);
    }

    const user = await userRepository.createUser({
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || 'user',
        profilePicture,
        isLoggedIn: true,
    });

    const accessToken = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        env.jwt.secret,
        {
            expiresIn: '1d',
        }
    );

    return { user, accessToken };
}

async function loginUser(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
        const warnMessage = `[LOGIN FAILED] email: ${email} |time: ${new Date().toISOString()}`;
        logger.warn(warnMessage);

        throw new ApiError(
            401,
            'Invalid credentials',
            warnMessage
        );
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
        const warnMessage = `[LOGIN FAILED] email: ${email} | reason: wrong password | time: ${new Date().toISOString()}`;

        logger.warn(warnMessage);

        throw new ApiError(
            401,
            'Invalid credentials',
            warnMessage
        );
    }

    const accessToken = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        env.jwt.secret,
        {
            expiresIn: '1d',
        }
    );

    // Atomically mark user as logged in
    await userRepository.updateUser(user._id, { isLoggedIn: true });

    return { user, accessToken };
}

async function getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return user;
}

async function logoutUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Atomically mark user as logged out
    await userRepository.updateUser(userId, { isLoggedIn: false });

    return true;
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
};
