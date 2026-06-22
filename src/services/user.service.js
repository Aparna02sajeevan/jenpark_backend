const ApiError = require('../utils/ApiError');
const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');

async function getAllUsers() {
    return userRepository.getAllUsers();
}

async function createUser(data) {

    const existing =
        await userRepository.findByEmail(
            data.email
        );
    if (existing) {
        throw new ApiError(
            409,
            'Email already exists'
        );
    }
    const passwordHash =
        await bcrypt.hash(
            data.password,
            10
        );

    return userRepository.createUser({
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || 'user',
        ...(data.profilePicture && { profilePicture: data.profilePicture }),
    });
}

async function updateUser(id, data) {

    const user =
        await userRepository.updateUser(
            id,
            data
        );

    if (!user) {
        throw new ApiError(
            404,
            'User not found'
        );
    }

    return user;
}

async function deleteUser(id) {
    const user = await userRepository.deleteUser(id);

    if (!user) {
        throw new ApiError(
            404,
            'User not found'
        );
    }

    return user;
}

module.exports = {
    getAllUsers,
    deleteUser,
    updateUser,
    createUser,
};