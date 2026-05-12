'use server';

import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function registerUser(formData: FormData) {
  try {
    await connectToDatabase();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const mobile = formData.get('mobile') as string;

    if (!name || !email || !password || !confirmPassword) {
      return { success: false, error: 'All required fields must be filled.' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: 'Email is already registered.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'customer', // Important: Force customer role for all public registrations
      // mobile is not in original schema, but we can store it or add to schema if needed
    });

    return { success: true, message: 'Account created successfully!' };
  } catch (error: any) {
    console.error('Registration Error:', error);
    return { success: false, error: error.message || 'Failed to create account.' };
  }
}
