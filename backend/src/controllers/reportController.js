import {
  getParticipationReport,
  getWellnessReport,
  exportParticipationCSV,
  exportParticipationPDF,
  exportWellnessPDF
} from '../services/reportService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getParticipation = async (req, res, next) => {
  try {
    const report = await getParticipationReport();
    return successResponse(res, {
      message: 'Participation report retrieved',
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

export const getWellness = async (req, res, next) => {
  try {
    const report = await getWellnessReport();
    return successResponse(res, {
      message: 'Wellness report retrieved',
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

export const exportParticipation = async (req, res, next) => {
  try {
    const format = (req.query.format || 'csv').toLowerCase();

    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="wellness_participation_report_${Date.now()}.pdf"`);
      return exportParticipationPDF(res);
    }

    // Default CSV
    const csvData = await exportParticipationCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="wellness_participation_report_${Date.now()}.csv"`);
    return res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};

export const exportWellness = async (req, res, next) => {
  try {
    const format = (req.query.format || 'csv').toLowerCase();

    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="wellness_executive_summary_${Date.now()}.pdf"`);
      return exportWellnessPDF(res);
    }

    // Default CSV
    const report = await getWellnessReport();
    const headers = [
      { label: 'Category', key: 'category' },
      { label: 'Activity Logs', key: 'count' },
      { label: 'Points Generated', key: 'points' }
    ];
    const { generateCSV } = await import('../utils/exportHelpers.js');
    const csvData = generateCSV(headers, report.categoryBreakdown);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="wellness_executive_summary_${Date.now()}.csv"`);
    return res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};
