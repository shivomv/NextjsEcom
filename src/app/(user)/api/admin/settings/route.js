import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Setting from '@/models/settingModel';
import { adminMiddleware } from '@/utils/auth';

/**
 * @desc    Get all settings or settings by group
 * @route   GET /api/admin/settings
 * @access  Private/Admin
 */
export async function GET(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');
    const isPublic = searchParams.get('isPublic');
    const tab = searchParams.get('tab');

    // Build query
    const query = {};
    if (group) {
      query.group = group;
    }
    if (isPublic === 'true') {
      query.isPublic = true;
    } else if (isPublic === 'false') {
      query.isPublic = false;
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
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * @desc    Create or update settings (batch)
 * @route   POST /api/admin/settings
 * @access  Private/Admin
 */
export async function POST(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();
    const data = await request.json();

    // New structured format: { tab: 'tabName', data: {...} }
    if (data.tab && data.data) {
      // Handle structured tab-based settings
      const { tab, data: tabData, isPublic = true } = data;

      // Find existing setting or create new one
      const existingSetting = await Setting.findOne({ key: tab });

      if (existingSetting) {
        // Update existing setting
        existingSetting.value = tabData;
        existingSetting.group = tab;
        existingSetting.isPublic = isPublic;

        const result = await existingSetting.save();
        return NextResponse.json(result);
      } else {
        // Create new setting
        const result = await Setting.create({
          key: tab,
          value: tabData,
          group: tab,
          isPublic: isPublic,
        });
        return NextResponse.json(result);
      }
    } else if (!Array.isArray(data) && typeof data === 'object') {
      // Handle legacy format: single object with multiple settings
      const settingsArray = Object.entries(data).map(([key, value]) => ({
        key,
        value,
        group: 'general',
        isPublic: true,
      }));

      // Process each setting
      const results = await Promise.all(
        settingsArray.map(async (setting) => {
          const { key, value, group, isPublic, description } = setting;

          // Find existing setting or create new one
          const existingSetting = await Setting.findOne({ key });

          if (existingSetting) {
            // Update existing setting
            existingSetting.value = value;
            if (group) existingSetting.group = group;
            if (typeof isPublic !== 'undefined') existingSetting.isPublic = isPublic;
            if (description) existingSetting.description = description;

            return await existingSetting.save();
          } else {
            // Create new setting
            return await Setting.create({
              key,
              value,
              group: group || 'general',
              isPublic: typeof isPublic !== 'undefined' ? isPublic : true,
              description: description || '',
            });
          }
        })
      );

      return NextResponse.json(results);
    } else if (Array.isArray(data)) {
      // Handle legacy format: array of settings
      const results = await Promise.all(
        data.map(async (setting) => {
          const { key, value, group, isPublic, description } = setting;

          // Find existing setting or create new one
          const existingSetting = await Setting.findOne({ key });

          if (existingSetting) {
            // Update existing setting
            existingSetting.value = value;
            if (group) existingSetting.group = group;
            if (typeof isPublic !== 'undefined') existingSetting.isPublic = isPublic;
            if (description) existingSetting.description = description;

            return await existingSetting.save();
          } else {
            // Create new setting
            return await Setting.create({
              key,
              value,
              group: group || 'general',
              isPublic: typeof isPublic !== 'undefined' ? isPublic : true,
              description: description || '',
            });
          }
        })
      );

      return NextResponse.json(results);
    } else {
      return NextResponse.json(
        { message: 'Invalid data format' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
