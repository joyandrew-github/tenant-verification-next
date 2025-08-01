import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import TenantVerification from '@/models/TenantVerification';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Test - Session:', session);
    
    if (!session) {
      return NextResponse.json({ error: 'No session' }, { status: 401 });
    }
    
    // Connect to database
    await connectDB();
    
    // Count all applications
    const count = await TenantVerification.countDocuments();
    
    // Find applications for this user
    const userApplications = await TenantVerification.find({ userId: session.user.id });
    
    return NextResponse.json({
      session: session.user,
      totalApplications: count,
      userApplications: userApplications.length,
      applications: userApplications
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 