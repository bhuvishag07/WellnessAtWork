import WellnessResource from '../models/WellnessResource.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getResources = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: new RegExp(search.trim(), 'i') } },
        { description: { $regex: new RegExp(search.trim(), 'i') } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } }
      ];
    }

    const resources = await WellnessResource.find(query).sort({ createdAt: -1 });

    return successResponse(res, {
      message: 'Resources fetched successfully',
      data: { resources }
    });
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (req, res, next) => {
  try {
    const resource = await WellnessResource.findById(req.params.id);
    if (!resource) {
      return errorResponse(res, { statusCode: 404, message: 'Resource not found' });
    }

    return successResponse(res, {
      message: 'Resource retrieved',
      data: { resource }
    });
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const resource = await WellnessResource.create({
      ...req.body,
      createdBy: req.user._id
    });

    return successResponse(res, {
      statusCode: 201,
      message: 'Resource created successfully',
      data: { resource }
    });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  try {
    const resource = await WellnessResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return errorResponse(res, { statusCode: 404, message: 'Resource not found' });
    }

    return successResponse(res, {
      message: 'Resource updated successfully',
      data: { resource }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resource = await WellnessResource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return errorResponse(res, { statusCode: 404, message: 'Resource not found' });
    }

    return successResponse(res, {
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
