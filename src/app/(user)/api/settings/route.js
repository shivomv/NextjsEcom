import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Setting from '@/models/settingModel';

/**
 * @desc    Get public settings
 * @route   GET /api/settings
 * @access  Public
 */
export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');
    const tab = searchParams.get('tab');

    // Build query - only return public settings
    const query = { isPublic: true };
    if (group) {
      query.group = group;
    }
    if (tab) {
      query.key = tab;
    }

    // Get settings
    const settings = await Setting.find(query);

    // Return a specific tab's data if requested
    if (tab && settings.length === 1) {
      return NextResponse.json(settings[0].value);
    }

    // Convert to key-value object if requested
    if (searchParams.get('format') === 'object') {
      const settingsObject = {};
      settings.forEach(setting => {
        settingsObject[setting.key] = setting.value;
      });
      return NextResponse.json(settingsObject);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

