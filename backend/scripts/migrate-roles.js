require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const migrationScript = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for migration');

    // Step 1: Update existing users without roles to have a default role
    const usersWithoutRoles = await User.find({ 
      $or: [
        { role: { $exists: false } }, 
        { role: { $in: ['user', 'admin'] } } // old roles
      ] 
    });

    console.log(`Found ${usersWithoutRoles.length} users to migrate`);

    for (const user of usersWithoutRoles) {
      // Default old 'admin' users to GOV_ADMIN, others to STUDENT
      const newRole = user.role === 'admin' ? 'GOV_ADMIN' : 'STUDENT';
      await User.findByIdAndUpdate(user._id, { 
        role: newRole,
        profile: user.profile || {}
      });
      console.log(`Migrated user ${user.email} to role ${newRole}`);
    }

    // Step 2: Create seed test users for each role (only if they don't exist)
    const seedUsers = [
      {
        name: 'John Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'STUDENT',
        profile: {
          rollNo: 'ST2024001',
          institution: 'Test University',
          degree: 'Computer Science'
        }
      },
      {
        name: 'Jane Employer',
        email: 'employer@test.com',
        password: 'password123',
        role: 'EMPLOYER',
        profile: {
          company: 'TechCorp Solutions',
          designation: 'HR Manager'
        }
      },
      {
        name: 'Dr. Mike Admin',
        email: 'institution@test.com',
        password: 'password123',
        role: 'INSTITUTION',
        profile: {
          institutionCode: 'INST001',
          institutionType: 'University'
        }
      },
      {
        name: 'Sarah Government',
        email: 'govadmin@test.com',
        password: 'password123',
        role: 'GOV_ADMIN',
        profile: {
          department: 'Higher Education',
          adminLevel: 'State'
        }
      }
    ];

    for (const userData of seedUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const user = await User.create(userData);
        console.log(`Created seed user: ${user.email} with role ${user.role}`);
      } else {
        console.log(`Seed user ${userData.email} already exists`);
      }
    }

    console.log('Migration completed successfully!');
    
    // Display summary
    const roleCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nUser count by role:');
    roleCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count} users`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrationScript();
}

module.exports = migrationScript;
