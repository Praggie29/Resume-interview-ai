const pdfParse = require("pdf-parse");
const crypto = require("crypto");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const cacheService = require("../services/cache.service");

/**
 * Generate Interview Report
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = "";

        if (req.file) {
            const data = await pdfParse(req.file.buffer);
            resumeText = data.text || "";
        }

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        if (!interviewReportByAi.title) {
            interviewReportByAi.title = jobDescription
                ? jobDescription.substring(0, 80).split("\n")[0].trim()
                : "Interview Report";
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        cacheService.del(`interviewReports:${req.user.id}`);

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to generate interview report.",
            error: error.message
        });
    }
}

/**
 * Get Interview Report By Id
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params;

    const cacheKey = `interviewReport:${req.user.id}:${interviewId}`;

    const interviewReport = await cacheService.getOrSet(
        cacheKey,
        async () => {
            return await interviewReportModel.findOne({
                _id: interviewId,
                user: req.user.id
            });
        },
        600
    );

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    });
}

/**
 * Get All Interview Reports
 */
async function getAllInterviewReportsController(req, res) {

    const cacheKey = `interviewReports:${req.user.id}`;

    const interviewReports = await cacheService.getOrSet(
        cacheKey,
        async () => {
            return await interviewReportModel
                .find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
        },
        300
    );

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    });
}


/**
 * Generate Resume PDF
 */
async function generateResumePdfController(req, res) {

    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const cacheKey = `pdf:${interviewReportId}`;
    const pdfBuffer = await cacheService.getOrSet(
        cacheKey,
        async () => {
            return await generateResumePdf({
                resume,
                jobDescription,
                selfDescription
            });
        },
        3600 // Cache for 1 hour (3600 seconds)
    );

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    });

    res.send(pdfBuffer);
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};