'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Calendar,
  Facebook,
  Instagram,
  Twitter,
  Ruler,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      toast.success('Message sent successfully!', {
        description: 'We\'ll get back to you within 24 hours.'
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast.error('Failed to send message', {
        description: 'Please try again later or contact us directly.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">We're here to help with all your menswear needs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Store Locations */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Visit Our Stores</h2>
              
              {/* Downtown Location */}
              <Card className="p-6 mb-4">
                <Badge className="mb-3 bg-gold/10 text-gold hover:bg-gold/20">Downtown</Badge>
                <h3 className="text-lg font-semibold mb-3">KCT Menswear Downtown</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p>213 S Kalamazoo Mall</p>
                      <p>Kalamazoo, MI 49007</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold" />
                    <a href="tel:269-342-1234" className="hover:text-gold transition-colors">
                      (269) 342-1234
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p>Mon-Fri: 10am - 6pm</p>
                      <p>Saturday: 10am - 5pm</p>
                      <p>Sunday: 12pm - 4pm</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </Card>

              {/* Portage Location */}
              <Card className="p-6">
                <Badge className="mb-3 bg-gold/10 text-gold hover:bg-gold/20">Portage</Badge>
                <h3 className="text-lg font-semibold mb-3">KCT Menswear Portage</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p>6650 S Westnedge Ave, Suite 154</p>
                      <p>Portage, MI 49024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold" />
                    <a href="tel:269-323-8070" className="hover:text-gold transition-colors">
                      (269) 323-8070
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p>Mon-Fri: 10am - 8pm</p>
                      <p>Saturday: 10am - 8pm</p>
                      <p>Sunday: 12pm - 6pm</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </Card>
            </div>

            {/* Additional Contact Methods */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gold" />
                  <a href="mailto:info@kctmenswear.com" className="text-gray-600 hover:text-gold transition-colors">
                    info@kctmenswear.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gold" />
                  <span className="text-gray-600">Live Chat Available Mon-Fri 9am-5pm EST</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gold" />
                  <a href="/appointments" className="text-gray-600 hover:text-gold transition-colors">
                    Book a Styling Appointment <ChevronRight className="inline w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-gold transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gold transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gold transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Ruler className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Custom Tailoring</h3>
              <p className="text-gray-600">Expert alterations and custom suit creation</p>
            </Card>
            <Card className="p-6 text-center">
              <Calendar className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personal Styling</h3>
              <p className="text-gray-600">One-on-one consultations with our style experts</p>
            </Card>
            <Card className="p-6 text-center">
              <Ruler className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Wedding Services</h3>
              <p className="text-gray-600">Complete wedding party outfitting and coordination</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}