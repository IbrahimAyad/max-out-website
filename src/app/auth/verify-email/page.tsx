import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Link href="/">
            <h1 className="text-3xl font-bold">KCT Menswear</h1>
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Check your email
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've sent you a verification email. Please click the link in the email to verify your account.
          </p>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or request a new one.
            </p>
            
            <Link 
              href="/auth/login" 
              className="inline-block text-black hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}