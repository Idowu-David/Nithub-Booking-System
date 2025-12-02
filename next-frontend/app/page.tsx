import Link from 'next/link'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Welcome to <span className="text-indigo-600">NitHub</span>
        </h1>
        <p className="text-xl text-gray-600">
          What would you like to do today?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
          <Link 
            href="/login"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md w-full sm:w-auto text-center"
          >
            Login
          </Link>
          <Link 
            href="/signup"
            className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-md w-full sm:w-auto text-center"
          >
            Sign Up
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-300 mt-12">
          <p className="text-sm text-gray-500 mb-4">Quick Access</p>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link href="/dashboard/user"
              className="px-6 py-2 text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              Go to User Dashboard →
            </Link>
            <Link 
              href="/dashboard/admin"
              className="px-6 py-2 text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              Go to Admin Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App