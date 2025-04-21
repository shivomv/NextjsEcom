import dbConnect from '@/utils/db';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    phone: '9876543211',
    role: 'user',
  },
];

export const seedUsers = async () => {
  try {
    await dbConnect();

    // Check if users already exist
    const count = await User.countDocuments();

    if (count === 0) {
      console.log('Seeding users...');

      // Hash passwords before inserting
      const usersWithHashedPasswords = await Promise.all(
        users.map(async (user) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(user.password, salt);

          return {
            ...user,
            password: hashedPassword,
          };
        })
      );

      await User.insertMany(usersWithHashedPasswords);
      console.log('Users seeded successfully!');
    } else {
      console.log('Users already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};
