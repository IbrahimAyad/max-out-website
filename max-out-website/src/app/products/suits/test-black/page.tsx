import Image from 'next/image';

export default function TestBlackSuit() {
  const blackSuitImages = [
    {
      url: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
      alt: 'Black Suit Main View'
    },
    {
      url: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/front.jpg',
      alt: 'Black Suit Front View'
    },
    {
      url: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/blacksuit3p.jpeg',
      alt: 'Black Suit 3-Piece View'
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Black Suit - Image Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blackSuitImages.map((image, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-medium">{image.alt}</h3>
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={image.alt}
                width={400}
                height={533}
                className="object-cover w-full h-full"
                unoptimized // For testing R2 images
              />
            </div>
            <p className="text-xs text-gray-500 break-all">{image.url}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Test Links</h2>
        <div className="space-y-2">
          <a 
            href="/products/suits" 
            className="block text-blue-600 hover:underline"
          >
            → View All Suits
          </a>
          <a 
            href="/products/suits/prod_SlRxbBl5ZnnoDy" 
            className="block text-blue-600 hover:underline"
          >
            → View Black Suit Product Page
          </a>
        </div>
      </div>
    </div>
  );
}