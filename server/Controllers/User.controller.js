import User from "../Models/User.Model.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId)

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        return res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            },
            message: "User is fetched successfully"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}