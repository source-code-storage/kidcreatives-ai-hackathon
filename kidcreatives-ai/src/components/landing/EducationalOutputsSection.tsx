import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Sparkles, ZoomIn } from 'lucide-react'
import { ImageZoomModal } from '@/components/ui/ImageZoomModal'
import { IMAGES } from '@/constants/images'

export function EducationalOutputsSection() {
  const [zoomedImage, setZoomedImage] = useState<{
    src: string
    alt: string
  } | null>(null)

  const handleImageClick = (src: string, alt: string) => {
    setZoomedImage({ src, alt })
  }

  const handleCloseZoom = () => {
    setZoomedImage(null)
  }
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-subject-blue/5 via-variable-purple/5 to-context-orange/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
            What Kids Take Home
          </h2>
          <p className="text-xl text-gray-600">
            Real learning artifacts, not just digital art
          </p>
        </motion.div>

        {/* Educational Outputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Achievement Certificate */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* Icon Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-action-green/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-action-green" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 font-display">Achievement Certificate</h3>
                <p className="text-sm text-gray-600">Printable proof of learning</p>
              </div>
            </div>

            {/* Certificate Image */}
            <div 
              className="relative aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 mb-4 cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => handleImageClick(IMAGES.landing.certificate, 'KidCreatives AI achievement certificate showing prompt engineering skills')}
            >
              <img
                src={IMAGES.landing.certificate}
                alt="KidCreatives AI achievement certificate showing prompt engineering skills"
                className="w-full h-full object-cover"
              />
              {/* Zoom icon overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              Every child receives a <span className="font-semibold text-action-green">personalized certificate</span> proving 
              their prompt engineering skills. It includes their creation, the AI instructions they wrote, and their name—perfect 
              for portfolios or the fridge! 🏆
            </p>
          </motion.div>

          {/* Prompt Master Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* Icon Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-variable-purple/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-variable-purple" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 font-display">Prompt Master Card</h3>
                <p className="text-sm text-gray-600">Collectible trading card</p>
              </div>
            </div>

            {/* Prompt Card Image */}
            <div 
              className="relative aspect-[4/3] bg-gradient-to-br from-variable-purple/10 to-subject-blue/10 rounded-xl overflow-hidden border-2 border-variable-purple/30 mb-4 cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => handleImageClick(IMAGES.landing.promptCard, 'Prompt Master Card showing AI instructions and creativity stats')}
            >
              <img
                src={IMAGES.landing.promptCard}
                alt="Prompt Master Card showing AI instructions and creativity stats"
                className="w-full h-full object-cover"
              />
              {/* Zoom icon overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              A <span className="font-semibold text-variable-purple">collectible trading card</span> showing the AI instructions 
              they created, creativity stats, and their artwork. Kids can collect these cards and see their prompt engineering 
              skills grow over time! ✨
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            These aren't just fun keepsakes—they're <span className="font-semibold text-subject-blue">proof of real AI literacy skills</span> that 
            kids can be proud of. Parents love having tangible evidence of learning!
          </p>
        </motion.div>
      </div>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        src={zoomedImage?.src || ''}
        alt={zoomedImage?.alt || ''}
        isOpen={!!zoomedImage}
        onClose={handleCloseZoom}
      />
    </section>
  )
}
