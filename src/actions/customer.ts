'use server';

import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import { deleteImage, extractFilePathFromUrl } from '@/lib/storage';

export async function getCustomers(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  status: string = '',
  role: string = ''
) {
  try {
    await connectToDatabase();

    // Build filter
    const filter: any = { role: 'customer' };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await User.countDocuments(filter);

    // Get customers
    const customers = await User.find(filter)
      .select('name email phone image status role totalOrders totalSpent lastLogin createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(customers)),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error('[getCustomers]', error);
    return { success: false, error: error.message };
  }
}

export async function getCustomerById(id: string) {
  try {
    await connectToDatabase();

    const customer = await User.findById(id)
      .populate('wishlist', 'title images price')
      .populate('reviews', 'rating comment')
      .lean();

    if (!customer) {
      return { success: false, error: 'Customer not found' };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(customer)),
    };
  } catch (error: any) {
    console.error('[getCustomerById]', error);
    return { success: false, error: error.message };
  }
}

export async function updateCustomerStatus(id: string, status: 'active' | 'blocked' | 'suspended') {
  try {
    await connectToDatabase();

    await User.findByIdAndUpdate(id, { status }, { new: true });
    revalidatePath('/admin/customers');

    return { success: true };
  } catch (error: any) {
    console.error('[updateCustomerStatus]', error);
    return { success: false, error: error.message };
  }
}

export async function updateCustomerRole(id: string, role: 'customer' | 'admin' | 'staff') {
  try {
    await connectToDatabase();

    await User.findByIdAndUpdate(id, { role }, { new: true });
    revalidatePath('/admin/customers');

    return { success: true };
  } catch (error: any) {
    console.error('[updateCustomerRole]', error);
    return { success: false, error: error.message };
  }
}

export async function updateCustomer(id: string, data: any) {
  try {
    await connectToDatabase();

    const { name, email, phone, image, imagePath, addresses } = data;

    // Get current customer for old image path
    const currentCustomer = await User.findById(id).lean();

    // Delete old image if a new one is provided
    if (imagePath && currentCustomer?.imagePath && imagePath !== currentCustomer.imagePath) {
      await deleteImage(currentCustomer.imagePath);
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (image) updateData.image = image;
    if (imagePath) updateData.imagePath = imagePath;
    if (addresses) updateData.addresses = addresses;

    await User.findByIdAndUpdate(id, updateData, { new: true });
    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/${id}`);

    return { success: true };
  } catch (error: any) {
    console.error('[updateCustomer]', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await connectToDatabase();

    // Get customer to retrieve image path
    const customer = await User.findById(id).lean();
    
    // Delete profile image if it exists
    if (customer?.imagePath) {
      await deleteImage(customer.imagePath);
    }

    await User.findByIdAndDelete(id);
    revalidatePath('/admin/customers');

    return { success: true };
  } catch (error: any) {
    console.error('[deleteCustomer]', error);
    return { success: false, error: error.message };
  }
}

export async function getCustomerAnalytics() {
  try {
    await connectToDatabase();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalCustomers, newCustomers, activeCustomers, topSpenders, averageOrderValue] =
      await Promise.all([
        User.countDocuments({ role: 'customer' }),
        User.countDocuments({ role: 'customer', createdAt: { $gte: thirtyDaysAgo } }),
        User.countDocuments({ role: 'customer', status: 'active' }),
        User.find({ role: 'customer' })
          .sort({ totalSpent: -1 })
          .limit(10)
          .select('name totalSpent image')
          .lean(),
        User.aggregate([
          { $match: { role: 'customer' } },
          { $group: { _id: null, avg: { $avg: '$totalSpent' } } },
        ]),
      ]);

    return {
      success: true,
      data: {
        totalCustomers,
        newCustomers,
        activeCustomers,
        topSpenders: JSON.parse(JSON.stringify(topSpenders)),
        averageOrderValue: averageOrderValue[0]?.avg || 0,
      },
    };
  } catch (error: any) {
    console.error('[getCustomerAnalytics]', error);
    return { success: false, error: error.message };
  }
}

export async function getCustomerGrowthData() {
  try {
    await connectToDatabase();

    const data = await User.aggregate([
      {
        $match: { role: 'customer' },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(data)),
    };
  } catch (error: any) {
    console.error('[getCustomerGrowthData]', error);
    return { success: false, error: error.message };
  }
}

export async function addCustomerAddress(customerId: string, address: any) {
  try {
    await connectToDatabase();

    const customer = await User.findById(customerId);
    if (!customer) {
      return { success: false, error: 'Customer not found' };
    }

    const newAddress = {
      id: Date.now().toString(),
      ...address,
    };

    customer.addresses.push(newAddress);
    await customer.save();
    revalidatePath(`/admin/customers/${customerId}`);

    return { success: true };
  } catch (error: any) {
    console.error('[addCustomerAddress]', error);
    return { success: false, error: error.message };
  }
}

export async function removeCustomerAddress(customerId: string, addressId: string) {
  try {
    await connectToDatabase();

    await User.findByIdAndUpdate(
      customerId,
      { $pull: { addresses: { id: addressId } } },
      { new: true }
    );

    revalidatePath(`/admin/customers/${customerId}`);

    return { success: true };
  } catch (error: any) {
    console.error('[removeCustomerAddress]', error);
    return { success: false, error: error.message };
  }
}

export async function toggleCustomerBlockStatus(id: string, isBlocked: boolean) {
  try {
    await connectToDatabase();
    const newStatus = isBlocked ? 'blocked' : 'active';
    await updateCustomerStatus(id, newStatus);
    return { success: true, message: `Customer ${isBlocked ? 'blocked' : 'unblocked'}` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
