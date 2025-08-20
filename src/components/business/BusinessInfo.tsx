// CRITICAL: This is the SINGLE SOURCE OF TRUTH for all business information
// Any changes here will automatically update everywhere on the site
// This ensures NAP (Name, Address, Phone) consistency for local SEO

export const BUSINESS_INFO = {
  // Official Business Names - Use EXACTLY these everywhere
  name: 'KCT Menswear',
  fullName: 'Kalamazoo Custom Tailoring & KCT Menswear',
  
  // Two store locations
  locations: {
    downtown: {
      name: 'Kalamazoo Custom Tailoring',
      shortName: 'Downtown Location',
      phone: '(269) 342-1234',
      phoneRaw: '2693421234',
      address: {
        street: '213 S Kalamazoo Mall',
        city: 'Kalamazoo',
        state: 'MI',
        zip: '49007',
        country: 'USA',
        full: '213 S Kalamazoo Mall, Kalamazoo, MI 49007',
        mapsUrl: 'https://maps.google.com/?q=213+S+Kalamazoo+Mall+Kalamazoo+MI+49007'
      },
      geo: {
        lat: 42.2917,
        lng: -85.5872
      },
      hours: {
        monday: { open: '10:00 AM', close: '7:00 PM' },
        tuesday: { open: '10:00 AM', close: '7:00 PM' },
        wednesday: { open: '10:00 AM', close: '7:00 PM' },
        thursday: { open: '10:00 AM', close: '7:00 PM' },
        friday: { open: '10:00 AM', close: '7:00 PM' },
        saturday: { open: '10:00 AM', close: '6:00 PM' },
        sunday: { open: '12:00 PM', close: '5:00 PM' }
      }
    },
    crossroads: {
      name: 'KCT Menswear',
      shortName: 'Crossroads Mall Location',
      phone: '(269) 323-8070',
      phoneRaw: '2693238070',
      address: {
        street: '6650 South Westnedge Avenue',
        city: 'Portage',
        state: 'MI',
        zip: '49024',
        country: 'USA',
        full: '6650 South Westnedge Avenue, Portage, MI 49024',
        mapsUrl: 'https://maps.google.com/?q=6650+South+Westnedge+Avenue+Portage+MI+49024'
      },
      geo: {
        lat: 42.2167,
        lng: -85.5997
      },
      hours: {
        monday: { open: '10:00 AM', close: '9:00 PM' },
        tuesday: { open: '10:00 AM', close: '9:00 PM' },
        wednesday: { open: '10:00 AM', close: '9:00 PM' },
        thursday: { open: '10:00 AM', close: '9:00 PM' },
        friday: { open: '10:00 AM', close: '9:00 PM' },
        saturday: { open: '10:00 AM', close: '9:00 PM' },
        sunday: { open: '11:00 AM', close: '7:00 PM' }
      }
    }
  },
  
  // Primary location for schema (Downtown)
  primaryLocation: {
    phone: '(269) 342-1234',
    phoneRaw: '2693421234',
    address: {
      street: '213 S Kalamazoo Mall',
      city: 'Kalamazoo',
      state: 'MI',
      zip: '49007',
      country: 'USA',
      full: '213 S Kalamazoo Mall, Kalamazoo, MI 49007',
      mapsUrl: 'https://maps.google.com/?q=213+S+Kalamazoo+Mall+Kalamazoo+MI+49007'
    },
    geo: {
      lat: 42.2917,
      lng: -85.5872
    }
  },
  
  // Combined hours (use primary location)
  hours: {
    monday: { open: '10:00 AM', close: '7:00 PM' },
    tuesday: { open: '10:00 AM', close: '7:00 PM' },
    wednesday: { open: '10:00 AM', close: '7:00 PM' },
    thursday: { open: '10:00 AM', close: '7:00 PM' },
    friday: { open: '10:00 AM', close: '7:00 PM' },
    saturday: { open: '10:00 AM', close: '6:00 PM' },
    sunday: { open: '12:00 PM', close: '5:00 PM' }
  },
  
  // Special hours or closures
  specialHours: {
    holidays: [
      { date: '2025-12-25', status: 'Closed', name: 'Christmas Day' },
      { date: '2025-01-01', status: 'Closed', name: 'New Year\'s Day' },
      { date: '2025-07-04', status: 'Closed', name: 'Independence Day' },
      { date: '2025-11-28', status: 'Closed', name: 'Thanksgiving' }
    ]
  },
  
  // Online presence - Keep these URLs current
  website: 'https://kctmenswear.com',
  email: 'info@kctmenswear.com',
  
  // Social media - EXACT URLs for citation consistency
  social: {
    facebook: 'https://www.facebook.com/kctmenswear',
    instagram: 'https://www.instagram.com/kctmenswear',
    twitter: 'https://twitter.com/kctmenswear',
    youtube: 'https://www.youtube.com/kctmenswear',
    linkedin: 'https://www.linkedin.com/company/kct-menswear',
    yelp: 'https://www.yelp.com/biz/kalamazoo-custom-tailoring-kalamazoo',
    google: 'https://g.page/kct-menswear'
  },
  
  // Business categories for directories
  categories: [
    'Men\'s Clothing Store',
    'Formal Wear Store',
    'Tuxedo Shop',
    'Suit Shop',
    'Wedding Store',
    'Custom Tailor'
  ],
  
  // Service areas for local SEO
  serviceAreas: [
    'Kalamazoo, MI',
    'Portage, MI',
    'Battle Creek, MI',
    'Mattawan, MI',
    'Paw Paw, MI',
    'Vicksburg, MI',
    'Richland, MI',
    'Galesburg, MI',
    'Comstock, MI',
    'Oshtemo, MI',
    'Texas Township, MI',
    'Schoolcraft, MI',
    'Three Rivers, MI',
    'Plainwell, MI',
    'Otsego, MI'
  ],
  
  // Business description for directories
  description: 'KCT Menswear and Kalamazoo Custom Tailoring is Southwest Michigan\'s premier destination for men\'s suits, tuxedos, and formal wear. With two convenient locations in Kalamazoo and Portage, we offer expert tailoring, wedding services, prom rentals, and custom fitting.',
  
  // Short tagline
  tagline: 'Southwest Michigan\'s Premier Menswear Since 1985',
  
  // Important for citations
  yearEstablished: '1985',
  
  // Payment methods accepted
  paymentMethods: [
    'Cash',
    'Visa',
    'Mastercard',
    'American Express',
    'Discover',
    'Apple Pay',
    'Google Pay',
    'Afterpay',
    'Klarna'
  ],
  
  // Languages spoken
  languages: ['English', 'Spanish'],
  
  // Amenities/Features
  amenities: [
    'Wheelchair Accessible',
    'Free Parking',
    'Free WiFi',
    'Alterations On-Site',
    'Same Day Service Available',
    'Private Fitting Rooms',
    'Group Appointments',
    'Virtual Consultations',
    'In-Store Pickup',
    'Curbside Pickup'
  ],
  
  // For structured data
  priceRange: '$$-$$$',
  
  // Owner/Key contact (for some directories)
  owner: {
    name: 'KCT Menswear Team',
    title: 'Management',
    email: 'management@kctmenswear.com'
  }
};

// Helper function to get formatted hours for a specific day
export function getHoursForDay(day: keyof typeof BUSINESS_INFO.hours): string {
  const hours = BUSINESS_INFO.hours[day];
  return `${hours.open} - ${hours.close}`;
}

// Helper function to check if currently open (checks primary location)
export function isOpenNow(): boolean {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = days[now.getDay()] as keyof typeof BUSINESS_INFO.hours;
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const hours = BUSINESS_INFO.hours[day];
  if (!hours) return false;
  
  // Convert time strings to numbers for comparison
  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 100 + minutes;
  };
  
  const openTime = parseTime(hours.open);
  const closeTime = parseTime(hours.close);
  
  return currentTime >= openTime && currentTime <= closeTime;
}

// Component for displaying consistent business info
export default function BusinessInfo({ location = 'primary' }: { location?: 'primary' | 'downtown' | 'crossroads' }) {
  const info = location === 'primary' 
    ? BUSINESS_INFO.primaryLocation 
    : BUSINESS_INFO.locations[location as 'downtown' | 'crossroads'];
    
  const name = location === 'primary'
    ? BUSINESS_INFO.name
    : BUSINESS_INFO.locations[location as 'downtown' | 'crossroads'].name;
    
  return (
    <div className="business-info" itemScope itemType="https://schema.org/ClothingStore">
      <h3 itemProp="name">{name}</h3>
      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
        <span itemProp="streetAddress">{info.address.street}</span><br />
        <span itemProp="addressLocality">{info.address.city}</span>, 
        <span itemProp="addressRegion">{info.address.state}</span> 
        <span itemProp="postalCode">{info.address.zip}</span>
      </div>
      <a href={`tel:${info.phoneRaw}`} itemProp="telephone">
        {info.phone}
      </a>
    </div>
  );
}