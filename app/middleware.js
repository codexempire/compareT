import { errorResponse, successResponse } from "./formatter";
import jwt from "jsonwebtoken";


export const tokenValidator = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return errorResponse(res, { error: "Token is required" }, 400);
        }

        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            return errorResponse(res, { error: "Invalid Token" }, 400);
        }

        const decodedObj = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userEmail = decodedObj.email;
        req.userId = decodedObj.id;

        return next();
    } catch (error) {
        return errorResponse(res, { error: "Server Error: Failed to validate token" }, 500);
    }
}