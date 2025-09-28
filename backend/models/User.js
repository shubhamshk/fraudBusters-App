const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['STUDENT', 'EMPLOYER', 'INSTITUTION', 'GOV_ADMIN'],
    required: true,
  },
  // Role-specific profile data
  profile: {
    // Student-specific
    rollNo: { type: String },
    institution: { type: String },
    degree: { type: String },
    
    // Employer-specific 
    company: { type: String },
    designation: { type: String },
    
    // Institution-specific
    institutionCode: { type: String },
    institutionType: { type: String }, // University, College, etc.
    
    // Government-specific
    department: { type: String },
    adminLevel: { type: String }, // District, State, National
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON responses
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
