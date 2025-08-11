'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const sellerRegistrationSchema = z.object({
  // Business Information
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.enum(['INDIVIDUAL', 'SOLE_PROPRIETORSHIP', 'PARTNERSHIP', 'LLC', 'CORPORATION', 'NONPROFIT']),
  description: z.string().min(10, 'Please provide a business description').max(500, 'Description must be under 500 characters').optional(),
  website: z.string().url('Please enter a valid URL (e.g., https://example.com)').optional().or(z.literal('')),
  phone: z.string().regex(/^[+]?[0-9\s\-\(\)]{10,}$/, 'Please enter a valid phone number (e.g., +1 555-123-4567)'),
  businessEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  
  // Contact Person
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  
  // Business Address
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  
  // Tax & Legal Information
  taxId: z.string().min(1, 'Tax ID is required for verification'),
  gstVatNumber: z.string().optional(),
  businessLicense: z.string().min(1, 'Business license number is required'),
  yearsInBusiness: z.coerce.number().min(0).max(100).optional(),
  
  // Social Media (Optional)
  facebookUrl: z.string().url('Please enter a valid Facebook URL').optional().or(z.literal('')),
  instagramUrl: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
  
  // Payment Information
  bankAccountHolder: z.string().min(1, 'Account holder name is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(1, 'Valid account number is required'),
  ifscSwiftCode: z.string().min(1, 'IFSC/SWIFT code is required'),
  bankBranchAddress: z.string().optional(),
  
  // Product Categories
  productCategories: z.array(z.string()).min(1, 'Please select at least one product category'),
  
  // Shipping
  managesOwnShipping: z.boolean().default(true),
  needsShippingHelp: z.boolean().default(false),
  
  // Terms
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
})

// type SellerRegistrationData = z.infer<typeof sellerRegistrationSchema>

const businessTypes = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'LLC', label: 'LLC' },
  { value: 'CORPORATION', label: 'Corporation' },
  { value: 'NONPROFIT', label: 'Non-Profit' },
]

const productCategories = [
  'Electronics', 'Fashion & Clothing', 'Home & Garden', 'Health & Beauty', 
  'Sports & Outdoors', 'Books & Media', 'Toys & Games', 'Automotive',
  'Food & Beverages', 'Art & Crafts', 'Jewelry & Accessories', 'Pet Supplies',
  'Office & Business', 'Baby & Kids', 'Music & Instruments', 'Other'
]

export default function SellerRegisterPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sellerRegistrationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      managesOwnShipping: true,
      needsShippingHelp: false,
      productCategories: [],
    }
  })

  const selectedCategories = watch('productCategories') || []

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const onSubmit = async (data: Record<string, any>) => {
    console.log('Form submission triggered with data:', data)
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/seller/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/seller/dashboard')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Something went wrong')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCategory = (category: string) => {
    const current = selectedCategories
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
    setValue('productCategories', updated)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your seller application has been submitted. Our team will review your information and get back to you within 3-5 business days.
            </p>
            <p className="text-sm text-gray-500">Redirecting to seller dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { title: 'Business Info', fields: ['businessName', 'businessType', 'description'] },
    { title: 'Contact & Address', fields: ['contactPersonName', 'phone', 'addressLine1'] },
    { title: 'Legal & Tax', fields: ['taxId', 'businessLicense'] },
    { title: 'Payment & Categories', fields: ['bankAccountHolder', 'bankName', 'productCategories'] },
    { title: 'Review & Submit', fields: ['termsAccepted'] }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Seller on Findora</h1>
          <p className="mt-2 text-gray-600">
            Join thousands of sellers and start growing your business with us
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep > index + 1 
                    ? 'bg-green-600 text-white' 
                    : currentStep === index + 1 
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-16 ${
                    currentStep > index + 1 ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}

            <div className="space-y-8">
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Name *
                        </label>
                        <Input
                          {...register('businessName')}
                          placeholder="Your official business name"
                          onBlur={() => trigger('businessName')}
                          className={errors.businessName ? 'border-red-500' : ''}
                        />
                        {errors.businessName && (
                          <p className="text-red-600 text-sm mt-1">{errors.businessName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Type *
                        </label>
                        <select
                          {...register('businessType')}
                          onBlur={() => trigger('businessType')}
                          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            errors.businessType ? 'border-red-500' : 'border-input'
                          }`}
                        >
                          <option value="">Select business type</option>
                          {businessTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        {errors.businessType && (
                          <p className="text-red-600 text-sm mt-1">{errors.businessType.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Description * (Max 500 characters)
                        </label>
                        <textarea
                          {...register('description')}
                          rows={4}
                          onBlur={() => trigger('description')}
                          className={`flex min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            errors.description ? 'border-red-500' : 'border-input'
                          }`}
                          placeholder="Briefly describe your business, including the products or services you offer..."
                        />
                        {errors.description && (
                          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <Input
                          {...register('website')}
                          type="url"
                          placeholder="https://your-website.com"
                          onBlur={() => trigger('website')}
                          className={errors.website ? 'border-red-500' : ''}
                        />
                        {errors.website && (
                          <p className="text-red-600 text-sm mt-1">{errors.website.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Email
                        </label>
                        <Input
                          {...register('businessEmail')}
                          type="email"
                          placeholder="business@example.com"
                          onBlur={() => trigger('businessEmail')}
                          className={errors.businessEmail ? 'border-red-500' : ''}
                        />
                        {errors.businessEmail && (
                          <p className="text-red-600 text-sm mt-1">{errors.businessEmail.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact & Address Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Person Name *
                        </label>
                        <Input
                          {...register('contactPersonName')}
                          placeholder="Full name of the person responsible"
                          onBlur={() => trigger('contactPersonName')}
                          className={errors.contactPersonName ? 'border-red-500' : ''}
                        />
                        {errors.contactPersonName && (
                          <p className="text-red-600 text-sm mt-1">{errors.contactPersonName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <Input
                          {...register('phone')}
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          onBlur={() => trigger('phone')}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <Input
                          {...register('addressLine1')}
                          placeholder="Street address"
                          onBlur={() => trigger('addressLine1')}
                          className={errors.addressLine1 ? 'border-red-500' : ''}
                        />
                        {errors.addressLine1 && (
                          <p className="text-red-600 text-sm mt-1">{errors.addressLine1.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <Input
                          {...register('addressLine2')}
                          placeholder="Apartment, suite, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <Input
                          {...register('city')}
                          placeholder="City"
                          onBlur={() => trigger('city')}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && (
                          <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province *
                        </label>
                        <Input
                          {...register('state')}
                          placeholder="State or province"
                          onBlur={() => trigger('state')}
                          className={errors.state ? 'border-red-500' : ''}
                        />
                        {errors.state && (
                          <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <Input
                          {...register('country')}
                          placeholder="Country"
                          onBlur={() => trigger('country')}
                          className={errors.country ? 'border-red-500' : ''}
                        />
                        {errors.country && (
                          <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code *
                        </label>
                        <Input
                          {...register('postalCode')}
                          placeholder="Postal code"
                          onBlur={() => trigger('postalCode')}
                          className={errors.postalCode ? 'border-red-500' : ''}
                        />
                        {errors.postalCode && (
                          <p className="text-red-600 text-sm mt-1">{errors.postalCode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facebook URL
                        </label>
                        <Input
                          {...register('facebookUrl')}
                          type="url"
                          placeholder="https://facebook.com/yourpage"
                          onBlur={() => trigger('facebookUrl')}
                          className={errors.facebookUrl ? 'border-red-500' : ''}
                        />
                        {errors.facebookUrl && (
                          <p className="text-red-600 text-sm mt-1">{errors.facebookUrl.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Instagram URL
                        </label>
                        <Input
                          {...register('instagramUrl')}
                          type="url"
                          placeholder="https://instagram.com/yourpage"
                          onBlur={() => trigger('instagramUrl')}
                          className={errors.instagramUrl ? 'border-red-500' : ''}
                        />
                        {errors.instagramUrl && (
                          <p className="text-red-600 text-sm mt-1">{errors.instagramUrl.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn URL
                        </label>
                        <Input
                          {...register('linkedinUrl')}
                          type="url"
                          placeholder="https://linkedin.com/company/yourpage"
                          onBlur={() => trigger('linkedinUrl')}
                          className={errors.linkedinUrl ? 'border-red-500' : ''}
                        />
                        {errors.linkedinUrl && (
                          <p className="text-red-600 text-sm mt-1">{errors.linkedinUrl.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Twitter URL
                        </label>
                        <Input
                          {...register('twitterUrl')}
                          type="url"
                          placeholder="https://twitter.com/yourpage"
                          onBlur={() => trigger('twitterUrl')}
                          className={errors.twitterUrl ? 'border-red-500' : ''}
                        />
                        {errors.twitterUrl && (
                          <p className="text-red-600 text-sm mt-1">{errors.twitterUrl.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Legal & Tax Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Tax & Legal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tax Identification Number (Tax ID/EIN) *
                        </label>
                        <Input
                          {...register('taxId')}
                          placeholder="Enter your official tax ID"
                          onBlur={() => trigger('taxId')}
                          className={errors.taxId ? 'border-red-500' : ''}
                        />
                        {errors.taxId && (
                          <p className="text-red-600 text-sm mt-1">{errors.taxId.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GST/VAT Number (if applicable)
                        </label>
                        <Input
                          {...register('gstVatNumber')}
                          placeholder="GST/VAT registration number"
                          onBlur={() => trigger('gstVatNumber')}
                          className={errors.gstVatNumber ? 'border-red-500' : ''}
                        />
                        {errors.gstVatNumber && (
                          <p className="text-red-600 text-sm mt-1">{errors.gstVatNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business License Number *
                        </label>
                        <Input
                          {...register('businessLicense')}
                          placeholder="Official business license number"
                          onBlur={() => trigger('businessLicense')}
                          className={errors.businessLicense ? 'border-red-500' : ''}
                        />
                        {errors.businessLicense && (
                          <p className="text-red-600 text-sm mt-1">{errors.businessLicense.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Years in Business
                        </label>
                        <Input
                          {...register('yearsInBusiness')}
                          type="number"
                          min="0"
                          max="100"
                          placeholder="How many years operational?"
                          onBlur={() => trigger('yearsInBusiness')}
                          className={errors.yearsInBusiness ? 'border-red-500' : ''}
                        />
                        {errors.yearsInBusiness && (
                          <p className="text-red-600 text-sm mt-1">{errors.yearsInBusiness.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment & Categories */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* Payment Information */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information (For Seller Payouts)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Account Holder Name *
                        </label>
                        <Input
                          {...register('bankAccountHolder')}
                          placeholder="Name as registered on bank account"
                          onBlur={() => trigger('bankAccountHolder')}
                          className={errors.bankAccountHolder ? 'border-red-500' : ''}
                        />
                        {errors.bankAccountHolder && (
                          <p className="text-red-600 text-sm mt-1">{errors.bankAccountHolder.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name *
                        </label>
                        <Input
                          {...register('bankName')}
                          placeholder="Name of your bank"
                          onBlur={() => trigger('bankName')}
                          className={errors.bankName ? 'border-red-500' : ''}
                        />
                        {errors.bankName && (
                          <p className="text-red-600 text-sm mt-1">{errors.bankName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Number *
                        </label>
                        <Input
                          {...register('accountNumber')}
                          placeholder="Your bank account number"
                          onBlur={() => trigger('accountNumber')}
                          className={errors.accountNumber ? 'border-red-500' : ''}
                        />
                        {errors.accountNumber && (
                          <p className="text-red-600 text-sm mt-1">{errors.accountNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IFSC/Swift Code *
                        </label>
                        <Input
                          {...register('ifscSwiftCode')}
                          placeholder="Bank IFSC or SWIFT code"
                          onBlur={() => trigger('ifscSwiftCode')}
                          className={errors.ifscSwiftCode ? 'border-red-500' : ''}
                        />
                        {errors.ifscSwiftCode && (
                          <p className="text-red-600 text-sm mt-1">{errors.ifscSwiftCode.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Branch Address (Optional)
                        </label>
                        <Input
                          {...register('bankBranchAddress')}
                          placeholder="Branch address if required"
                          onBlur={() => trigger('bankBranchAddress')}
                          className={errors.bankBranchAddress ? 'border-red-500' : ''}
                        />
                        {errors.bankBranchAddress && (
                          <p className="text-red-600 text-sm mt-1">{errors.bankBranchAddress.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Categories */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Categories *</h3>
                    <p className="text-sm text-gray-600 mb-4">Select the types of products you plan to sell</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {productCategories.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                    {errors.productCategories && (
                      <p className="text-red-600 text-sm mt-2">{errors.productCategories.message}</p>
                    )}
                  </div>

                  {/* Shipping Capabilities */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Capabilities *</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          {...register('managesOwnShipping')}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I manage my own shipping and logistics
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          {...register('needsShippingHelp')}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I require platform assistance for fulfillment and shipping
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit Application</h2>
                    
                    {/* Terms and Conditions */}
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Terms and Conditions</h3>
                      <div className="max-h-40 overflow-y-auto text-sm text-gray-700 space-y-2">
                        <p><strong>1. Seller Agreement:</strong> By registering as a seller, you agree to comply with all Findora policies and guidelines.</p>
                        <p><strong>2. Product Quality:</strong> You are responsible for ensuring all products meet quality standards and accurate descriptions.</p>
                        <p><strong>3. Order Fulfillment:</strong> Orders must be processed and shipped within the specified timeframe.</p>
                        <p><strong>4. Customer Service:</strong> You must provide responsive customer service for your products.</p>
                        <p><strong>5. Fees and Payments:</strong> Standard marketplace fees apply to all sales transactions.</p>
                        <p><strong>6. Data Security:</strong> All provided information will be kept secure and used only for verification purposes.</p>
                        <p><strong>7. Account Suspension:</strong> Findora reserves the right to suspend accounts for policy violations.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-start">
                        <input
                          {...register('termsAccepted')}
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I have read and agree to Findora&apos;s Terms and Conditions and Privacy Policy *
                        </span>
                      </label>
                      {errors.termsAccepted && (
                        <p className="text-red-600 text-sm">{errors.termsAccepted.message}</p>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Our team will verify your information within 3-5 business days</li>
                        <li>• You&apos;ll receive email updates on your application status</li>
                        <li>• Once approved, you can start listing products immediately</li>
                        <li>• You&apos;ll have access to seller tools and analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      // Move to next step without validation for now
                      setCurrentStep(currentStep + 1)
                    }}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={isLoading}
                    className="min-w-[150px] ml-auto"
                    onClick={async () => {
                      console.log('Submit button clicked')
                      // Get current form values
                      const formData = watch()
                      console.log('Current form data:', formData)
                      
                      // Test if we can call onSubmit directly
                      try {
                        await onSubmit(formData)
                      } catch (error) {
                        console.error('Submission error:', error)
                      }
                    }}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}