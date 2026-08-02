const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const cacheService = require("../services/cache.service")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = ""
        if (req.file) {
            const data = await pdfParse(req.file.buffer)
            resumeText = data.text || ""
        }

        const { selfDescription, jobDescription } = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        console.log("AI Report:", JSON.stringify(interViewReportByAi, null, 2))

        // Fallback title in case AI omits it
        if (!interViewReportByAi.title) {
            interViewReportByAi.title = jobDescription
                ? jobDescription.substring(0, 80).split("\n")[0].trim()
                : "Interview Report"
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        // Invalidate cached "all reports" list for this user since a new report was created
        cacheService.del(`interviewReports:list:${req.user.id}`)

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error in generateInterViewReportController:", error)
        res.status(500).json({
            message: "Failed to generate interview report.",
            error: error.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    // Reports are immutable once created, so cache them keyed by user + report id.
    // TTL is 10 minutes (600s).
    const cacheKey = `interviewReport:${req.user.id}:${interviewId}`

    const cachedReport = cacheService.get(cacheKey)
    if (cachedReport) {
        return res.status(200).json({
            message: "Interview report fetched successfully (cached).",
            interviewReport: cachedReport
        })
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    cacheService.set(cacheKey, interviewReport.toObject ? interviewReport.toObject() : interviewReport, 600)

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    // Cache the user's report list. TTL is 5 minutes (300s).
    // Invalidated when a new report is generated.
    const cacheKey = `interviewReports:list:${req.user.id}`

    const cachedReports = cacheService.get(cacheKey)
    if (cachedReports) {
        return res.status(200).json({
            message: "Interview reports fetched successfully (cached).",
            interviewReports: cachedReports
        })
    }

    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    cacheService.set(cacheKey, interviewReports, 300)

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }