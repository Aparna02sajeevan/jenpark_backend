const User = require('../models/User.model');

async function findByEmail(email) {
    return User.findOne({ email }).select('+passwordHash');
}

async function findById(id) {
    return User.findById(id);
}

async function createUser(data) {
    return User.create(data);
}

async function getAllUsers() {
    return User.find();
}

async function deleteUser(id) {
    return User.findByIdAndDelete(id);
}
async function updateUser(id, data) {
    return User.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );
}

module.exports = {
    findByEmail,
    findById,
    createUser,
    getAllUsers,
    deleteUser,
    updateUser,
};
