import { useState } from 'react'
import type { ConnectProps, ContactFormData, ProfessionalLink } from '../types'

export function Connect({
  contactInfo,
  professionalLinks,
  formFields,
  sectionContent,
  onFormSubmit,
  onDownloadVCard,
  onLinkClick
}: ConnectProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    onFormSubmit?.(formData)
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getLinkIcon = (link: ProfessionalLink) => {
    switch (link.icon) {
      case 'film':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
        )
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      case 'mail':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'phone':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        )
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <header className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-stone-50 to-amber-50/30 dark:from-stone-900 dark:via-stone-900 dark:to-blue-950/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-600 dark:text-amber-400 font-medium tracking-wide uppercase text-sm mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-white mb-6 leading-tight">
            {sectionContent.title}
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            {sectionContent.intro}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
                Send a Message
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                      {formFields.name.label}
                      {formFields.name.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      id="name"
                      required={formFields.name.required}
                      placeholder={formFields.name.placeholder}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                      {formFields.email.label}
                      {formFields.email.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="email"
                      id="email"
                      required={formFields.email.required}
                      placeholder={formFields.email.placeholder}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                      {formFields.phone.label}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder={formFields.phone.placeholder}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                      {formFields.message.label}
                      {formFields.message.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <textarea
                      id="message"
                      required={formFields.message.required}
                      placeholder={formFields.message.placeholder}
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-base transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* vCard & Links Column */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* QR Code Card */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
                Save My Contact
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-6">
                Scan the QR code or download my contact card
              </p>

              {/* QR Code Placeholder - Replace with real QR code */}
              <div className="inline-block p-4 bg-white rounded-xl shadow-inner mb-6">
                <div className="w-48 h-48 bg-stone-100 dark:bg-stone-200 rounded-lg flex items-center justify-center">
                  {/* QR Code pattern representation */}
                  <svg className="w-40 h-40 text-stone-800" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="5" y="5" width="25" height="25" />
                    <rect x="8" y="8" width="19" height="19" fill="white" />
                    <rect x="11" y="11" width="13" height="13" />
                    <rect x="70" y="5" width="25" height="25" />
                    <rect x="73" y="8" width="19" height="19" fill="white" />
                    <rect x="76" y="11" width="13" height="13" />
                    <rect x="5" y="70" width="25" height="25" />
                    <rect x="8" y="73" width="19" height="19" fill="white" />
                    <rect x="11" y="76" width="13" height="13" />
                    <rect x="35" y="5" width="5" height="5" />
                    <rect x="45" y="5" width="5" height="5" />
                    <rect x="55" y="5" width="5" height="5" />
                    <rect x="35" y="15" width="5" height="5" />
                    <rect x="50" y="15" width="5" height="5" />
                    <rect x="35" y="25" width="5" height="5" />
                    <rect x="45" y="25" width="5" height="5" />
                    <rect x="60" y="25" width="5" height="5" />
                    <rect x="5" y="35" width="5" height="5" />
                    <rect x="15" y="35" width="5" height="5" />
                    <rect x="25" y="35" width="5" height="5" />
                    <rect x="40" y="35" width="5" height="5" />
                    <rect x="55" y="35" width="5" height="5" />
                    <rect x="70" y="35" width="5" height="5" />
                    <rect x="85" y="35" width="5" height="5" />
                    <rect x="5" y="45" width="5" height="5" />
                    <rect x="20" y="45" width="5" height="5" />
                    <rect x="35" y="45" width="5" height="5" />
                    <rect x="50" y="45" width="5" height="5" />
                    <rect x="65" y="45" width="5" height="5" />
                    <rect x="80" y="45" width="5" height="5" />
                    <rect x="5" y="55" width="5" height="5" />
                    <rect x="15" y="55" width="5" height="5" />
                    <rect x="30" y="55" width="5" height="5" />
                    <rect x="45" y="55" width="5" height="5" />
                    <rect x="60" y="55" width="5" height="5" />
                    <rect x="75" y="55" width="5" height="5" />
                    <rect x="90" y="55" width="5" height="5" />
                    <rect x="35" y="70" width="5" height="5" />
                    <rect x="50" y="70" width="5" height="5" />
                    <rect x="65" y="70" width="5" height="5" />
                    <rect x="80" y="70" width="5" height="5" />
                    <rect x="35" y="80" width="5" height="5" />
                    <rect x="45" y="80" width="5" height="5" />
                    <rect x="60" y="80" width="5" height="5" />
                    <rect x="75" y="80" width="5" height="5" />
                    <rect x="90" y="80" width="5" height="5" />
                    <rect x="40" y="90" width="5" height="5" />
                    <rect x="55" y="90" width="5" height="5" />
                    <rect x="70" y="90" width="5" height="5" />
                    <rect x="85" y="90" width="5" height="5" />
                  </svg>
                </div>
              </div>

              {/* Contact Info Preview */}
              <div className="mb-6 text-sm text-stone-600 dark:text-stone-400">
                <p className="font-semibold text-stone-900 dark:text-white">{contactInfo.fullName}</p>
                <p>{contactInfo.title}</p>
              </div>

              {/* Download Button */}
              <button
                onClick={onDownloadVCard}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Contact
              </button>
            </div>

            {/* Professional Links */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
                Find Me Online
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {professionalLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    onClick={(e) => {
                      if (onLinkClick) {
                        e.preventDefault()
                        onLinkClick(link.id)
                      }
                    }}
                    target={link.type === 'imdb' || link.type === 'linkedin' ? '_blank' : undefined}
                    rel={link.type === 'imdb' || link.type === 'linkedin' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {getLinkIcon(link)}
                    </div>
                    <span className="font-medium text-stone-900 dark:text-white">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
              <h2 className="text-xl font-bold mb-4">
                Prefer Direct Contact?
              </h2>
              <div className="space-y-3">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{contactInfo.email}</span>
                </a>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{contactInfo.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
