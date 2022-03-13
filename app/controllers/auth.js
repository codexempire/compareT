import { errorResponse, successResponse, generateString } from "../formatter";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/users";

export const createAssistant = async (req, res) => {
    try {
        
        const { name, email } = req.body;

        const userExits = await Users.findOne({ email: email.toLowerCase() });

        if (userExits) {
            return errorResponse(res, { error: "User with this email exists" }, 409);
        }

        const randomPassword = generateString(10);

        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        if (!hashedPassword) {
            return errorResponse(res, { error: "Algorithm failed to hash password" }, 503);
        }

        const user = await Users.create({
            email: email.toLowerCase(),
            name,
            password: hashedPassword,
        });

        return successResponse(res, { data: { ...user.toJSON(), password: randomPassword } }, 201);

    } catch (error) {
        return errorResponse(res, { error: "Server Error" }, 500);
    }
}

export const resetPassword = async (req, res) => {
    try {
        
        const { password, email } = req.body;

        const user = await Users.findOne({ email: email.toLowerCase() });

        if (!user) {
            return errorResponse(res, { error: "User with this email does not exists" }, 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!hashedPassword) {
            return errorResponse(res, { error: "Algorithm failed to hash password" }, 503);
        }

        user.password = hashedPassword;
        await user.save();

        return successResponse(res, { data: { ...user.toJSON() } }, 202);

    } catch (error) {
        console.log("SErver reset Password error >>> ", error);
        return errorResponse(res, { error: "Server Error" }, 500);
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email: email.toLowerCase() });

        console.log("User >>> ", user);

        if (!user) {
            return errorResponse(res, { error: "Invalid User Credentials" }, 404);
        }

        const matchingPasswords = await bcrypt.compare(password, user.password);
        console.log("Pasword >>> ", matchingPasswords)


        if (!matchingPasswords) {
            return errorResponse(res, { error: "Invalid User Credentials" }, 409);
        }

        console.log("here")

        // sign token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: 24 * 60 * 60 });

        return successResponse(res, { data: { token } }, 200);
    } catch (error) {
        return errorResponse(res, { error: "Server Error" }, 500);
    }
}