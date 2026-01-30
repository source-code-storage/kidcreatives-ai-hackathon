import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { IMAGES } from '@/constants/images'

export function ExampleGallerySection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
            See How Kids Add AI Magic to Their Art
          </h2>
          <p className="text-xl text-gray-600">
            Your drawing + AI enhancement = Something amazing!
          </p>
        </motion.div>

        {/* Hero Before/After Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Original Drawing */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-context-orange/20 flex items-center justify-center">
                <span className="text-context-orange font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-display">Your Drawing</h3>
            </div>
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
              <img
                src={IMAGES.landing.originalDrawing}
                alt="Child's original drawing of a robot"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-600 text-sm mt-4 text-center">
              A child's creative sketch
            </p>
          </motion.div>

          {/* AI Enhanced Version */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-subject-blue/10 via-variable-purple/10 to-context-orange/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-subject-blue/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-subject-blue/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-subject-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-display">AI Magic Added!</h3>
            </div>
            <div className="aspect-square bg-white rounded-xl overflow-hidden border-2 border-subject-blue/50">
              <img
                src={IMAGES.landing.aiEnhanced}
                alt="AI-enhanced version of the robot drawing"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-700 text-sm mt-4 text-center font-medium">
              Transformed with AI while keeping the original style! ✨
            </p>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            Kids learn how their creative decisions become <span className="font-semibold text-subject-blue">AI instructions</span>.
            They see exactly how texture, lighting, and style choices transform their art while preserving their unique vision.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
