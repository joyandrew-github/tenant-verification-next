import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);

    // If no active session, return 401 Unauthorized
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    // Ensure DB connection
    await connectDB();

    // Search user by email from session
    const user = await User.findOne({ email: session.user.email }).select('-password');

    // If user not found in DB
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Return user profile (excluding sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/profile error:', error);
    return NextResponse.json({ success: false, error: 'Server error: ' + error.message }, { status: 500 });
  }
}
