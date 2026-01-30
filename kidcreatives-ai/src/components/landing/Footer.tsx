export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <img 
            src="/logo/logo.png" 
            alt="KidCreatives AI" 
            className="h-12 w-auto mx-auto mb-4"
          />
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Empowering young creators with AI literacy and pride in their art.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <button 
            onClick={(e) => e.preventDefault()} 
            className="text-gray-400 hover:text-gray-300 transition-colors cursor-not-allowed opacity-50"
            disabled
          >
            About (Coming Soon)
          </button>
          <button 
            onClick={(e) => e.preventDefault()} 
            className="text-gray-400 hover:text-gray-300 transition-colors cursor-not-allowed opacity-50"
            disabled
          >
            Privacy Policy (Coming Soon)
          </button>
          <button 
            onClick={(e) => e.preventDefault()} 
            className="text-gray-400 hover:text-gray-300 transition-colors cursor-not-allowed opacity-50"
            disabled
          >
            Contact (Coming Soon)
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          © 2026 KidCreatives AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
