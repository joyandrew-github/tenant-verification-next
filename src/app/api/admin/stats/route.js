import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import TenantVerification from '@/models/TenantVerification';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Connect to database
    await connectDB();
    
    // Get statistics
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications
    ] = await Promise.all([
      TenantVerification.countDocuments(),
      TenantVerification.countDocuments({ status: 'pending' }),
      TenantVerification.countDocuments({ status: 'approved' }),
      TenantVerification.countDocuments({ status: 'rejected' })
    ]);
    
    return NextResponse.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats: ' + error.message }, { status: 500 });
  }
} 