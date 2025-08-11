import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

const sellerRegistrationSchema = z.object({
  // Business Information
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.enum(['INDIVIDUAL', 'SOLE_PROPRIETORSHIP', 'PARTNERSHIP', 'LLC', 'CORPORATION', 'NONPROFIT']),
  description: z.string().min(10, 'Please provide a business description').max(500, 'Description must be under 500 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  phone: z.string().regex(/^[+]?[0-9\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  businessEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  
  // Contact Person
  contactPersonName: z.string().min(2),
  
  // Business Address
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  
  // Tax & Legal Information
  taxId: z.string().min(5),
  gstVatNumber: z.string().optional(),
  businessLicense: z.string().min(3),
  yearsInBusiness: z.coerce.number().min(0).max(100).optional(),
  
  // Social Media (Optional)
  facebookUrl: z.string().url('Please enter a valid Facebook URL').optional().or(z.literal('')),
  instagramUrl: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
  
  // Payment Information
  bankAccountHolder: z.string().min(2),
  bankName: z.string().min(2),
  accountNumber: z.string().min(8),
  ifscSwiftCode: z.string().min(8),
  bankBranchAddress: z.string().optional(),
  
  // Product Categories
  productCategories: z.array(z.string()).min(1),
  
  // Shipping
  managesOwnShipping: z.boolean().default(true),
  needsShippingHelp: z.boolean().default(false),
  
  // Terms
  termsAccepted: z.boolean().refine(val => val === true),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedFields = sellerRegistrationSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validatedFields.error.flatten() },
        { status: 400 }
      )
    }

    const data = validatedFields.data

    // Check if user already has a seller profile
    const existingSeller = await db.sellerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingSeller) {
      return NextResponse.json(
        { message: 'You already have a seller profile' },
        { status: 409 }
      )
    }

    // Create seller profile
    const sellerProfile = await db.sellerProfile.create({
      data: {
        userId: session.user.id,
        businessName: data.businessName,
        businessType: data.businessType,
        description: data.description || null,
        website: data.website || null,
        phone: data.phone,
        businessEmail: data.businessEmail || null,
        contactPersonName: data.contactPersonName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        taxId: data.taxId,
        gstVatNumber: data.gstVatNumber || null,
        businessLicense: data.businessLicense,
        yearsInBusiness: data.yearsInBusiness || null,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        twitterUrl: data.twitterUrl || null,
        bankAccountHolder: data.bankAccountHolder,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscSwiftCode: data.ifscSwiftCode,
        bankBranchAddress: data.bankBranchAddress || null,
        productCategories: data.productCategories,
        managesOwnShipping: data.managesOwnShipping,
        needsShippingHelp: data.needsShippingHelp,
        termsAccepted: data.termsAccepted,
        termsAcceptedAt: data.termsAccepted ? new Date() : null,
        verificationStatus: 'PENDING',
      },
      select: {
        id: true,
        businessName: true,
        businessType: true,
        verificationStatus: true,
        createdAt: true,
      }
    })

    // Update user role to SELLER
    await db.user.update({
      where: { id: session.user.id },
      data: { role: 'SELLER' }
    })

    return NextResponse.json(
      {
        message: 'Seller profile created successfully',
        seller: sellerProfile,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Seller registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}