'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const documentTypes = [
  { value: 'ID_FRONT', label: 'Government ID (Front)', required: true },
  { value: 'ID_BACK', label: 'Government ID (Back)', required: true },
  { value: 'BUSINESS_LICENSE', label: 'Business License', required: false },
  { value: 'TAX_DOCUMENT', label: 'Tax Document', required: false },
  { value: 'BANK_STATEMENT', label: 'Bank Statement', required: false },
  { value: 'UTILITY_BILL', label: 'Utility Bill', required: false },
]

interface UploadedFile {
  type: string
  file: File
  preview: string
}

export default function SellerDocumentsPage() {
  const { data: session, status } = useSession()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const router = useRouter()

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handleFileSelect = (type: string, file: File | null) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Only JPEG, PNG, and PDF files are allowed' })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' })
      return
    }

    // Create preview URL
    const preview = URL.createObjectURL(file)

    // Update uploaded files
    setUploadedFiles(prev => {
      const filtered = prev.filter(f => f.type !== type)
      return [...filtered, { type, file, preview }]
    })

    setMessage({ type: 'success', text: `${file.name} uploaded successfully` })
  }

  const removeFile = (type: string) => {
    setUploadedFiles(prev => prev.filter(f => f.type !== type))
    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type]!.value = ''
    }
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = async () => {
    const requiredTypes = documentTypes.filter(t => t.required).map(t => t.value)
    const uploadedTypes = uploadedFiles.map(f => f.type)
    const missingRequired = requiredTypes.filter(type => !uploadedTypes.includes(type))

    if (missingRequired.length > 0) {
      const missingLabels = documentTypes
        .filter(t => missingRequired.includes(t.value))
        .map(t => t.label)
      setMessage({ 
        type: 'error', 
        text: `Please upload required documents: ${missingLabels.join(', ')}` 
      })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      // Here you would typically upload files to a cloud storage service
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setMessage({ 
        type: 'success', 
        text: 'Documents uploaded successfully! Your verification is under review.' 
      })
      
      // Redirect after success
      setTimeout(() => {
        router.push('/seller/dashboard')
      }, 3000)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to upload documents. Please try again.' 
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <button onClick={() => router.push('/seller/dashboard')} className="hover:text-gray-700">
              Seller Dashboard
            </button>
            <span>/</span>
            <span className="text-gray-900">Upload Documents</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Verification Documents</h1>
          <p className="mt-2 text-gray-600">
            Upload the required documents to verify your seller account and start selling on Findora.
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'error' 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Document Upload Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Required Documents</h2>
            <p className="text-sm text-gray-500 mt-1">
              All documents will be kept secure and used only for verification purposes.
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {documentTypes.map((docType) => {
                const uploadedFile = uploadedFiles.find(f => f.type === docType.value)
                
                return (
                  <div key={docType.value} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center">
                          {docType.label}
                          {docType.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {docType.required ? 'Required for verification' : 'Optional but recommended'}
                        </p>
                      </div>
                      {uploadedFile && (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 text-sm font-medium">Uploaded</span>
                          <button
                            onClick={() => removeFile(docType.value)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {!uploadedFile ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400">
                        <input
                          ref={(el) => { fileInputRefs.current[docType.value] = el }}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileSelect(docType.value, e.target.files?.[0] || null)}
                          className="hidden"
                          id={`file-${docType.value}`}
                        />
                        <label
                          htmlFor={`file-${docType.value}`}
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-gray-600">Click to upload or drag and drop</span>
                          <span className="text-sm text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</span>
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {uploadedFile.file.type.startsWith('image/') ? (
                            <img
                              src={uploadedFile.preview}
                              alt="Preview"
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-red-100 rounded flex items-center justify-center">
                              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-gray-900">{uploadedFile.file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/seller/dashboard')}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploading || uploadedFiles.length === 0}
                className="min-w-[150px]"
              >
                {uploading ? 'Uploading...' : 'Submit Documents'}
              </Button>
            </div>

            {/* Info Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Verification Process</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Documents are reviewed within 24-48 hours</li>
                <li>• You&apos;ll receive email updates on verification status</li>
                <li>• All documents are encrypted and stored securely</li>
                <li>• Contact support if you need assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}