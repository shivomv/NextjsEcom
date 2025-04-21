import { NextResponse } from 'next/server';
import { seedDatabase } from '@/utils/seed';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Seed the database with initial data
 * @route   POST /api/seed
 * @access  Private/Admin
 */
export async function POST(request) {
  try {
    // Check if in development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { message: 'Seeding is only allowed in development environment' },
        { status: 403 }
      );
    }

    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    // Run seeders
    await seedDatabase();

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
