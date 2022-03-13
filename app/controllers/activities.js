import {
    errorResponse,
    successResponse
} from "../formatter"
import Uploads from "../models/uploads";
import AssignmentComparisons from "../models/assignmentsComparison";
import * as cloudinary from "../cloudinary";
import fs from "fs";
import path from "path";
import stringSimilarity from "string-similarity";
import cloudinarySDK from "cloudinary";
import request from "request";

export const uploadStudentAssignment = async (req, res) => {
    try {
        const uploader = async (path) => await cloudinary.uploads(path, "Assignments");

        const urls = [];
        const files = req.files;

        if (files.length !== 2) {
            return errorResponse(res, {
                error: "Upload the 2 files to be compared"
            }, 400);
        }

        for (const file of files) {
            const {
                path
            } = file;

            const newPath = await uploader(path)
            urls.push({...newPath, path});
        }

        urls[0].studentName = req.body.firstStudentName;
        urls[1].studentName = req.body.secondStudentName;

        const fileIds = [];

        for (const urlUpload of urls) {
            const file = await Uploads.create(urlUpload);
            fileIds.push(file._id)
        }

        const assignment = await AssignmentComparisons.create({
            assignment1: fileIds[0],
            assignment2: fileIds[1],
            comparisonPercentage: req.comparisonPercentage,
            staff: req.userId
        })
        
        const responseData = await AssignmentComparisons.findOne({ _id: assignment._id }).populate("assignment1 assignment2 staff");

        return successResponse(res, {
            data: {
                message: "Files have been compared and uploaded successfully",
                assignment: responseData,
            }
        }, 201);
    } catch (error) {
        console.log("ERror >>> ", error)
        return errorResponse(res, {
            error: "Server Error: Failed to upload the files"
        }, 500)
    }
}

export const compareAssignments = async (req, res, next) => {
    try {
        
        const files = req.files;
        const { firstStudentName, secondStudentName } = req.body;

        console.log("body >>> ", req.body, req.files)

        if (!firstStudentName || !firstStudentName.trim().length) {
            return errorResponse(res, { error: "Provide the name of the first student" }, 400)
        }

        if (!secondStudentName || !secondStudentName.trim().length) {
            return errorResponse(res, { error: "Provide the name of the first student" }, 400)
        }

        if (!files || files?.length !== 2) {
            return errorResponse(res, {
                error: "Upload the 2 files to be compared"
            }, 400);
        }

        const file1 = fs.readFileSync(path.resolve(files[0].path), 'utf-8');
        const file2 = fs.readFileSync(path.resolve(files[1].path), 'utf-8');

        const comparison = stringSimilarity.compareTwoStrings(file1, file2);

        req.comparisonPercentage = Number((comparison * 100).toFixed(2));

        return next();
    } catch (error) {
        console.log("Error >>>", error);
        return errorResponse(res, {
            error: "Server Error: Failed to compare the files"
        }, 500)
    }
}

export const getPreviousChecks = async (req, res, next) => {
    try {
        
        const previousChecks = await AssignmentComparisons.find({ staff: req.userId }).populate("assignment1 assignment2 staff")

        return successResponse(res, { data: previousChecks }, 200);
    } catch (error) {
        console.log("getPreviousChecks >>> ", error)
        return errorResponse(res, { error: "Server Error" }, 500)
    }
}

export const getSingleCheck = async (req, res, next) => {
    try {
        
        const previousCheck = await AssignmentComparisons.findOne({ _id: req.params.id }).populate("assignment1 assignment2 staff")

        if (!previousCheck) {
            return errorResponse(res, { error: "Failed to find previous check" }, 404);
        }

        return successResponse(res, { data: previousCheck }, 200);
    } catch (error) {
        console.log("getPreviousChecks >>> ", error)
        return errorResponse(res, { error: "Server Error" }, 500)
    }
}

export const rerun = async (req, res) => {
    try {
        
        const previousCheck = await AssignmentComparisons.findOne({ _id: req.params.id }).populate("assignment1 assignment2 staff")

        if (!previousCheck) {
            return errorResponse(res, { error: "Failed to find previous check" }, 404);
        }

        const firstAssignment = fs.readFileSync(path.resolve(previousCheck.assignment1.path), "utf-8");
        const secondAssignment = fs.readFileSync(path.resolve(previousCheck.assignment2.path), "utf-8");

        const comparison = stringSimilarity.compareTwoStrings(firstAssignment, secondAssignment);

        previousCheck.comparisonPercentage = Number((comparison * 100).toFixed(2));
        await previousCheck.save();

        return successResponse(res, { data: previousCheck }, 200);
        
    } catch (error) {
        console.log("rerun >>> ", error)
        return errorResponse(res, { error: "Server Error" }, 500)
    }
}