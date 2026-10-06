const Student = require('../models/Student');
const Company = require('../models/Company');

// @desc    Get current user profile details
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    let profile = null;

    if (req.user.role === 'student') {
      profile = await Student.findOne({ user: req.user._id });
    } else if (req.user.role === 'company') {
      profile = await Company.findOne({ user: req.user._id });
    } else if (req.user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin profile cannot be retrieved from this endpoint' });
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

// @desc    Update profile details
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { role } = req.user;

    if (role === 'student') {
      let student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student profile not found' });
      }

      const { name, phone, skills, education, experience, contactDetails } = req.body;

      // Handle properties
      if (name) student.name = name;
      if (phone !== undefined) student.phone = phone;

      // Skills: parse if sent as string or array
      if (skills) {
        if (typeof skills === 'string') {
          student.skills = skills.split(',').map(s => s.trim()).filter(s => s);
        } else if (Array.isArray(skills)) {
          student.skills = skills;
        }
      }

      // Parse nested collections if sent as JSON strings (important for form-data uploads)
      if (education) {
        student.education = typeof education === 'string' ? JSON.parse(education) : education;
      }
      if (experience) {
        student.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
      }
      if (contactDetails) {
        const parsedContacts = typeof contactDetails === 'string' ? JSON.parse(contactDetails) : contactDetails;
        student.contactDetails = { ...student.contactDetails, ...parsedContacts };
      }

      // Check if file uploaded for resume
      if (req.file) {
        student.resume = req.file.filename; // stores file name in database
      }

      await student.save();
      return res.status(200).json({ success: true, message: 'Student profile updated successfully', profile: student });

    } else if (role === 'company') {
      let company = await Company.findOne({ user: req.user._id });
      if (!company) {
        return res.status(404).json({ success: false, message: 'Company profile not found' });
      }

      const { name, description, website, location, industry, contactEmail, contactPhone } = req.body;

      if (name) company.name = name;
      if (description !== undefined) company.description = description;
      if (website !== undefined) company.website = website;
      if (location !== undefined) company.location = location;
      if (industry !== undefined) company.industry = industry;
      if (contactEmail) company.contactEmail = contactEmail;
      if (contactPhone !== undefined) company.contactPhone = contactPhone;

      await company.save();
      return res.status(200).json({ success: true, message: 'Company profile updated successfully', profile: company });
    }

    res.status(400).json({ success: false, message: 'Invalid role profile update request' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

module.exports = { getProfile, updateProfile };
