import { query } from 'express';
import Doctor from '../models/DoctorSchema.js';

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Successfully Updated',
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to Update' });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    await Doctor.findByIdAndUpdate(id);
    res.status(200).json({ success: true, message: 'Successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to Delete' });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id).populate('reviews').select('-password');
    res
      .status(200)
      .json({ success: true, message: 'Doctor found', data: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: 'No Doctor found' });
  }
};

export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: 'approved',
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { specialization: { $regex: query, $options: 'i' } },
        ],
      });
    } else {
      const doctors = await Doctor.find({ isApproved: 'Approved' }).select(
        '-password'
      );
    }

    res
      .status(200)
      .json({ success: true, message: 'Doctors found', data: doctors });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not found' });
  }
};
