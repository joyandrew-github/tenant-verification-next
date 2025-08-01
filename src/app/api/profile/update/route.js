import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Connect to database
    await connectDB();
    
    // Process form data
    const formData = await request.formData();
    
    // Get form fields
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const address = formData.get('address');
    const imageFile = formData.get('image');
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }
    
    // Check if email is already taken by another user (excluding current user)
    if (email !== session.user.email) {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return NextResponse.json({ error: 'Email is already taken by another user' }, { status: 400 });
      }
    }
    
    // Handle image upload if provided
    let imageUrl = session.user.image; // Keep existing image if no new one
    
    if (imageFile && imageFile.size > 0) {
      try {
        const imageBuffer = await imageFile.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');
        const imageDataURI = `data:${imageFile.type};base64,${imageBase64}`;
        
        const uploadResult = await cloudinary.uploader.upload(imageDataURI, {
          folder: 'profile-images',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }
          ]
        });
        
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }
    
    // Update user in database - find by email since we're using GitHub OAuth
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name,
        email,
        phone: phone || undefined,
        address: address || undefined,
        image: imageUrl
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        image: updatedUser.image,
        role: updatedUser.role
      }
    });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile: ' + error.message }, { status: 500 });
  }
} 