const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const userService = require('../services/user.service');
const { uploadToS3 } = require('../utils/s3');

const getUsers = asyncHandler(async (req, res) => {

    const users = await userService.getAllUsers();

    return success(res, {
        message: 'Users fetched successfully',
        data: users,
    });

});
const createUser =
    asyncHandler(async (req, res) => {

        const userData = { ...req.body };

        if (req.file) {
            // Upload profile picture to S3 and store the public URL
            userData.profilePicture = await uploadToS3(
                req.file.buffer,
                req.file.originalname,
                'users',
                req.file.mimetype
            );
        }

        const user =
            await userService.createUser(userData);

        return success(res, {
            statusCode: 201,
            message: 'User created successfully',
            data: user,
        });

    });

const updateUser =
    asyncHandler(async (req, res) => {

        const updateData = { ...req.body };

        if (req.file) {
            // Upload to S3 and store the public URL
            updateData.profilePicture = await uploadToS3(
                req.file.buffer,
                req.file.originalname,
                'users',
                req.file.mimetype
            );
        }

        const user =
            await userService.updateUser(
                req.params.id,
                updateData
            );

        return success(res, {
            message: 'User updated successfully',
            data: user,
        });

    });

const removeUser = asyncHandler(async (req, res) => {

    await userService.deleteUser(
        req.params.id
    );

    return success(res, {
        message: 'User deleted successfully',
    });

});

module.exports = {
    getUsers,
    removeUser,
    createUser,
    updateUser,
};