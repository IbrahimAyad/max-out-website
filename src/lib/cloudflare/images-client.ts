// Cloudflare Images integration
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'ea644c4a47a499ad4721449cbac587f4';
const IMAGES_API_TOKEN = 'Chn3Hcgcy-BQ306WCrA6bT5gSTa5wE-F0SfxNR4k'; // Your Images API token
const ACCOUNT_HASH = 'QI-O2U_ayTU_H_Ilcb4c6Q';

export async function uploadToCloudflareImages(
  imageUrl: string,
  metadata: {
    occasion: string;
    tieColor: string;
    suitColor: string;
    shirtColor: string;
    tieStyle: string;
    season?: string;
  }
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('url', imageUrl);
    formData.append('metadata', JSON.stringify({
      type: 'style-swipe',
      ...metadata
    }));

    // Create a custom ID for the image
    const customId = `style-swipe-${metadata.occasion}-${metadata.tieColor}-${metadata.suitColor}-${Date.now()}`;
    formData.append('id', customId);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${IMAGES_API_TOKEN}`,
        },
        body: formData
      }
    );

    const data = await response.json();

    if (data.success) {
      // Return the Cloudflare Images delivery URL
      const imageId = data.result.id;
      return `https://imagedelivery.net/${ACCOUNT_HASH}/${imageId}/public`;
    } else {

      return null;
    }
  } catch (error) {

    return null;
  }
}

export async function getStyleSwipeImages(occasion?: string) {
  try {
    const url = new URL(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`);
    if (occasion) {
      url.searchParams.append('meta.occasion', occasion);
    }
    url.searchParams.append('meta.type', 'style-swipe');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${IMAGES_API_TOKEN}`,
      }
    });

    const data = await response.json();

    if (data.success) {
      return data.result.images.map((img: any) => ({
        id: img.id,
        url: `https://imagedelivery.net/${ACCOUNT_HASH}/${img.id}/public`,
        metadata: img.meta,
        uploaded: img.uploaded
      }));
    }

    return [];
  } catch (error) {

    return [];
  }
}