const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {

    const result = await authService.registerUser({ ...req.body, file: req.file ?? null });

    return success(res, {
        statusCode: 201,
        message: 'Registered and logged in successfully',
        data: result,
    });

});

const login = asyncHandler(async (req, res) => {
    const result = await authService.loginUser(
        req.body.email,
        req.body.password
    );

    return success(res, {
        message: 'Login Successful',
        data: result,
    });
});

const profile = asyncHandler(async (req, res) => {

    const user =
        await authService.getProfile(req.user.id);

    return success(res, {
        message: 'Profile fetched',
        data: user
    });
});

const logout =
    asyncHandler(async (req, res) => {

        await authService.logoutUser(req.user.id);

        return success(res, {
            message: 'Logout successful',
            data: null,
        });

    });

const updateProfile = asyncHandler(async (req, res) => {


    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const user = await authService.updateProfile(req.user.id, {
        ...req.body,
        file: req.file ?? null
    });

    return success(res, {
        message: 'Profile updated successfully',
        data: user,
    });
});

module.exports = {
    register,
    login,
    profile,
    logout,
    updateProfile,
}
