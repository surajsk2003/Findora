import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch seller profile
    const sellerProfile = await db.sellerProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        businessName: true,
        businessType: true,
        description: true,
        website: true,
        phone: true,
        verificationStatus: true,
        averageRating: true,
        totalRatings: true,
        totalSales: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!sellerProfile) {
      return NextResponse.json(
        { message: 'Seller profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      seller: sellerProfile
    })
  } catch (error) {
    console.error('Error fetching seller profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}