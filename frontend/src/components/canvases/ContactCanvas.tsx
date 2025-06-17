import React from 'react'
import { useAethelframeStore } from '@store/useAethelframeStore'
import { useTranslations } from '../../lib/translations'

interface ContactCanvasProps {
  language: 'en' | 'ar'
  isDarkTheme: boolean
  name: string
  setName: (name: string) => void
  email: string
  setEmail: (email: string) => void
  subject: string
  setSubject: (subject: string) => void
  message: string
  setMessage: (message: string) => void
  handleSubmitMessage: (e: React.FormEvent) => void
}

const ContactCanvas: React.FC<ContactCanvasProps> = ({ 
  language, 
  isDarkTheme, 
  name, 
  setName, 
  email, 
  setEmail, 
  subject, 
  setSubject, 
  message, 
  setMessage, 
  handleSubmitMessage 
}) => {
  const { currentPhase } = useAethelframeStore()
  const t = useTranslations(language)
  
  // Aurora glass theme - dark glass styling for readability
  const currentTheme = {
    text: 'text-white',
    textSecondary: 'text-gray-200',
    textMuted: 'text-gray-300',
    accent: 'text-teal-400',
    maroon: 'text-red-400',
    navy: 'text-blue-400',
    accentBg: 'bg-teal-500',
    cardBg: 'bg-gray-900/80',
    inputBg: 'bg-gray-800/90',
    border: 'border-gray-600/50',
    bgTertiary: 'bg-gray-800/60',
    gradientStart: '',
    gradientMid: '',
    gradientEnd: ''
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Arabic Calligraphy Component
  const ArabicCalligraphyElement = ({ className }: { className: string }) => (
    <div className={`arabic-element ${className}`}>
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <path
          d="M10,20 Q30,5 50,20 T90,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10,25 Q30,40 50,25 T90,25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="22.5" r="2" fill="currentColor" />
      </svg>
    </div>
  )

  return (
    <section className="h-screen pt-32 pb-16 relative snap-start flex flex-col justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>          
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              <span className={currentTheme.text}>
                {t.contact.title}
              </span>
              <span className={`absolute -bottom-2 left-1/4 right-1/4 h-1 ${currentTheme.accentBg} rounded-full`}></span>
            </h2>
            <p className={`text-xl ${currentTheme.textSecondary} max-w-2xl mx-auto mt-6`}>
              {t.contact.subtitle}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-16 justify-between">
            <div className="md:w-2/5">
              <div className={`rounded-2xl ${currentTheme.cardBg} backdrop-blur-md ${currentTheme.border} border p-8 transform transition-all duration-500`}>
                <div className="space-y-6">
                  <div className={`flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full ${currentTheme.bgTertiary} flex items-center justify-center ${currentTheme.text}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div className={language === 'ar' ? 'text-right' : ''}>
                      <h3 className={`text-lg font-medium mb-1 ${currentTheme.text}`}>{t.contact.email}</h3>
                      <p className={currentTheme.accent}>hello@aethelframe.com</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full ${currentTheme.bgTertiary} flex items-center justify-center ${currentTheme.text}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <div className={language === 'ar' ? 'text-right' : ''}>
                      <h3 className={`text-lg font-medium mb-1 ${currentTheme.text}`}>{t.contact.social}</h3>
                      <div className="flex gap-4 mt-2">
                        <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>Twitter</a>
                        <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>Instagram</a>
                        <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>Behance</a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ArabicCalligraphyElement className={`w-40 h-24 ${currentTheme.textMuted} opacity-20 mx-auto mt-12`} />
              </div>
            </div>
            
            <div className="md:w-3/5">
              <div className={`rounded-2xl ${currentTheme.cardBg} backdrop-blur-md ${currentTheme.border} border p-8 transform transition-all duration-500 relative overflow-hidden`}>
                
                <h3 className={`text-2xl font-bold mb-6 relative z-10 ${currentTheme.text} ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.contact.sendMessage}</h3>
                
                <form onSubmit={handleSubmitMessage} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm ${currentTheme.textMuted} mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.contact.form.name}</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full ${currentTheme.inputBg} ${currentTheme.border} border rounded-full px-6 py-3 ${currentTheme.text} focus:${currentTheme.accent} focus:outline-none transition-colors ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        placeholder={t.contact.form.namePlaceholder}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm ${currentTheme.textMuted} mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.contact.form.email}</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full ${currentTheme.inputBg} ${currentTheme.border} border rounded-full px-6 py-3 ${currentTheme.text} focus:${currentTheme.accent} focus:outline-none transition-colors ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        placeholder={t.contact.form.emailPlaceholder}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm ${currentTheme.textMuted} mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.contact.form.subject}</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={`w-full ${currentTheme.inputBg} ${currentTheme.border} border rounded-full px-6 py-3 ${currentTheme.text} focus:${currentTheme.accent} focus:outline-none transition-colors ${language === 'ar' ? 'text-right' : 'text-left'}`}
                      placeholder={t.contact.form.subjectPlaceholder}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm ${currentTheme.textMuted} mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.contact.form.message}</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full ${currentTheme.inputBg} ${currentTheme.border} border rounded-3xl px-6 py-3 ${currentTheme.text} focus:${currentTheme.accent} focus:outline-none transition-colors min-h-32 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                      placeholder={t.contact.form.messagePlaceholder}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    ></textarea>
                  </div>
                  
                  <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                    <button 
                      type="submit"
                      className={`px-8 py-3 rounded-full ${currentTheme.accentBg} hover:opacity-90 transition-all duration-300 text-white font-medium shadow-lg`}
                    >
                      {t.contact.form.send}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to top button */}
      <button 
        onClick={() => scrollToSection('home')}
        className={`back-to-top fixed ${language === 'ar' ? 'left-8' : 'right-8'} bottom-8 w-12 h-12 rounded-full ${currentTheme.bgTertiary} backdrop-blur-sm flex items-center justify-center ${currentTheme.text} z-30 hover:${currentTheme.accent} transition-all duration-300 shadow-lg`}
        title={t.common.backToTop}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18,15 12,9 6,15"></polyline>
        </svg>
      </button>
      
      {/* Footer */}
      <footer className={`py-10 ${currentTheme.bg} ${currentTheme.border} border-t relative z-10 mt-20`}>
        <div className="container mx-auto px-8">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-6 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
            <div className="logo-container relative">
              <h1 className={`text-2xl font-bold ${currentTheme.text}`}>
                AETHEL<span className={currentTheme.accent}>FRAME</span>
              </h1>
            </div>
            
            <p className={`text-sm ${currentTheme.textMuted} ${language === 'ar' ? 'text-center md:text-right' : 'text-center md:text-left'}`}>
              {t.contact.footer.copyright}
            </p>
            
            <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>
                {t.contact.footer.terms}
              </a>
              <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>
                {t.contact.footer.privacy}
              </a>
              <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>
                {t.contact.footer.cookies}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}

export default ContactCanvas