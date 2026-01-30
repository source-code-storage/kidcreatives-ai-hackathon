import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HeroSection } from './HeroSection'
import { HowItWorksSection } from './HowItWorksSection'
import { FeaturesSection } from './FeaturesSection'
import { ExampleGallerySection } from './ExampleGallerySection'
import { EducationalOutputsSection } from './EducationalOutputsSection'
import { ParentSection } from './ParentSection'
import { Footer } from './Footer'
import { UsernameModal } from '@/components/auth'

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <div className="min-h-screen">
        <HeroSection onStartCreating={() => setShowAuthModal(true)} />
        <HowItWorksSection />
        <FeaturesSection />
        <ExampleGallerySection />
        <EducationalOutputsSection />
        <ParentSection />
        <Footer />
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <UsernameModal onClose={() => setShowAuthModal(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
