// This would be your API route for submitting tenant verification applications
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TenantVerification from '@/models/TenantVerification';
import connectDB from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('GET - Session user:', session.user);
    console.log('GET - User ID from session:', session.user.id);
    
    // Connect to database
    await connectDB();
    
    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('GET - User ID from query params:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Find the most recent application for this user
    const application = await TenantVerification.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('GET - Found application:', application);
    
    return NextResponse.json({ application });
  } catch (error) {
    console.error('Error fetching application status:', error);
    return NextResponse.json({ error: 'Failed to fetch application status: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Session user:', session.user);
    console.log('User ID from session:', session.user.id);
    
    // Connect to database
    await connectDB();
    
    // Process form data and file uploads
    const formData = await request.formData();
    
    console.log('Form data received:', {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      currentAddress: formData.get('currentAddress'),
      employmentStatus: formData.get('employmentStatus'),
      income: formData.get('income'),
    });
    
    // Handle file uploads to Cloudinary
    let idDocUrl = '';
    let incomeProofUrl = '';
    
    // Get the files from the form data
    const idDoc = formData.get('identificationDocument');
    const incomeProof = formData.get('proofOfIncome');
    
    console.log('Files received:', {
      idDoc: idDoc ? 'Present' : 'Missing',
      incomeProof: incomeProof ? 'Present' : 'Missing'
    });
    
    // Upload ID document to Cloudinary if provided
    if (idDoc && idDoc.size > 0) {
      const idBuffer = await idDoc.arrayBuffer();
      const idBase64 = Buffer.from(idBuffer).toString('base64');
      const idDataURI = `data:${idDoc.type};base64,${idBase64}`;
      
      const idUploadResult = await cloudinary.uploader.upload(idDataURI, {
        folder: 'tenant-verification/id-documents',
      });
      
      idDocUrl = idUploadResult.secure_url;
      console.log('ID document uploaded:', idDocUrl);
    }
    
    // Upload income proof to Cloudinary if provided
    if (incomeProof && incomeProof.size > 0) {
      const incomeBuffer = await incomeProof.arrayBuffer();
      const incomeBase64 = Buffer.from(incomeBuffer).toString('base64');
      const incomeDataURI = `data:${incomeProof.type};base64,${incomeBase64}`;
      
      const incomeUploadResult = await cloudinary.uploader.upload(incomeDataURI, {
        folder: 'tenant-verification/income-proofs',
      });
      
      incomeProofUrl = incomeUploadResult.secure_url;
      console.log('Income proof uploaded:', incomeProofUrl);
    }
    
    // Create new verification application using session userId
    const verification = await TenantVerification.create({
      userId: session.user.id,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      currentAddress: formData.get('currentAddress'),
      employmentStatus: formData.get('employmentStatus'),
      income: formData.get('income'),
      identificationDocument: idDocUrl || 'placeholder-url', // Temporary fallback
      proofOfIncome: incomeProofUrl || 'placeholder-url', // Temporary fallback
      notes: formData.get('notes') || '',
    });
    
    console.log('Created verification:', verification);
    
    return NextResponse.json({ success: true, verification }, { status: 201 });
  } catch (error) {
    console.error('Error creating verification:', error);
    return NextResponse.json({ error: 'Failed to create verification: ' + error.message }, { status: 500 });
  }
}