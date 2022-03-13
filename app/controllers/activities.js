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
            urls.push(newPath);
            fs.unlinkSync(path);
        }

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

        console.log("files >>> ", files)
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