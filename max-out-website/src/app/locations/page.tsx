'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar,
  Navigation,
  Scissors,
  Users,
  Car,
  Star,
  CheckCircle,
  ChevronRight
} from 'lucide-react'

export default function LocationsPage() {
  const locations = [
    {
      id: 'downtown',
      name: 'Downtown Store',
      subtitle: 'Our flagship location in the heart of downtown Kalamazoo',
      address: '213 S Kalamazoo Mall',
      city: 'Kalamazoo, MI 49007',
      phone: '(269) 342-1234',
      hours: {
        'Monday - Friday': '10am - 6pm',
        'Saturday': '10am - 4pm',
        'Sunday': 'Closed'
      },
      features: ['Expert Tailoring', 'Wedding Specialists', 'Premium Collections', 'Custom Fittings'],
      description: 'Our downtown flagship store offers the complete KCT Menswear experience with expert tailoring services, premium collections, and personalized styling consultations.',
      specialties: ['Wedding Consultations', 'Corporate Events', 'Black-Tie Affairs', 'Custom Alterations'],
      image: '/images/downtown-store.jpg'
    },
    {
      id: 'portage',
      name: 'Portage Store - Crossroads Mall',
      subtitle: 'Modern location with extended hours and group fitting rooms',
      address: '6650 S Westnedge Ave',
      city: 'Portage, MI 49024',
      phone: '(269) 323-8070',
      hours: {
        'Monday - Saturday': '10am - 9pm',
        'Sunday': '12pm - 6pm'
      },
      features: ['Extended Hours', 'Prom Specialists', 'Group Fitting Rooms', 'Rental Services'],
      description: 'Our Portage location specializes in prom and group events, featuring extended hours and spacious group fitting rooms perfect for wedding parties and prom groups.',
      specialties: ['Prom Events', 'Group Fittings', 'Suit Rentals', 'Quick Alterations'],
      image: '/images/portage-store.jpg'
    }
  ]

  const serviceAreas = [
    'Kalamazoo', 'Portage', 'Battle Creek', 'Mattawan', 
    'Paw Paw', 'Plainwell', 'Richland', 'Schoolcraft', 
    'Three Rivers', 'Vicksburg'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Locations</h1>
            <p className="text-xl text-gray-300 mb-8">
              Two convenient locations serving the greater Kalamazoo area with premium menswear and expert tailoring services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-gold hover:bg-gold/90 text-black font-medium px-8 py-3"
                onClick={() => document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Find a Store
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3"
                onClick={() => window.location.href = '/contact'}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section id="locations" className="py-16 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {locations.map((location, index) => (
              <Card key={location.id} className="overflow-hidden hover:shadow-2xl transition-shadow bg-white">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative h-80 lg:h-96 bg-gradient-to-br from-gray-200 to-gray-300 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-gold fill-current" />
                        <span className="text-sm">Premium Location</span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-1">{location.name}</h3>
                      <p className="text-sm opacity-90">{location.subtitle}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-8 lg:p-10 space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    {/* Address & Contact */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-lg">{location.address}</p>
                          <p className="text-gray-600">{location.city}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                        <a href={`tel:${location.phone}`} className="text-gold hover:text-gold/80 font-medium">
                          {location.phone}
                        </a>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">{location.description}</p>

                    {/* Store Hours */}
                    <div className="border-t pt-6">
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gold" />
                        Store Hours
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {Object.entries(location.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center py-1">
                            <span className="text-gray-600">{day}</span>
                            <span className="font-medium">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Store Features */}
                    <div className="border-t pt-6">
                      <h4 className="font-bold text-lg mb-3">Store Features</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {location.features.map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="border-t pt-6">
                      <h4 className="font-bold text-lg mb-3">Our Specialties</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {location.specialties.map(specialty => (
                          <div key={specialty} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />
                            <span>{specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        className="flex-1 bg-gold hover:bg-gold/90 text-black font-medium"
                        onClick={() => {
                          const query = encodeURIComponent(`${location.address} ${location.city}`)
                          window.open(`https://maps.google.com/?q=${query}`, '_blank')
                        }}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.location.href = '/contact'}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Services Available at Both Locations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Both of our locations offer comprehensive menswear services with expert staff ready to help you look your best.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Tailoring</h3>
              <p className="text-sm text-gray-600">Professional alterations and custom fitting services</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Personal Styling</h3>
              <p className="text-sm text-gray-600">One-on-one styling consultations and wardrobe advice</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Event Services</h3>
              <p className="text-sm text-gray-600">Wedding parties, prom groups, and corporate events</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Convenient Parking</h3>
              <p className="text-sm text-gray-600">Easy parking available at both downtown and mall locations</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Service Area</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Proudly serving customers throughout Southwest Michigan with premium menswear and tailoring services.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {serviceAreas.map(city => (
              <div key={city} className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                <ChevronRight className="h-4 w-4 text-gold flex-shrink-0" />
                <span className="font-medium">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Visit Us?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Stop by either location for personalized service, expert advice, and the finest selection of menswear in Southwest Michigan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="bg-gold hover:bg-gold/90 text-black font-medium px-8 py-3"
              onClick={() => window.location.href = '/contact'}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now: (269) 342-1234
            </Button>
            <Button 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3"
              onClick={() => window.location.href = '/contact'}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}