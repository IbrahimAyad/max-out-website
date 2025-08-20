import { NextRequest, NextResponse } from 'next/server';
import { uploadStyleSwiperImage } from '@/lib/cloudflare/r2-client';
import { ImageProcessor } from '@/lib/cloudflare/image-processor';
import { FashionAnalyzer } from '@/lib/ai/fashion-analyzer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';
    const variantType = formData.get('variantType') as string || 'style-swiper';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate and optimize image
    const validation = await ImageProcessor.validateAndOptimize(buffer);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid image' },
        { status: 400 }
      );
    }

    // Generate a unique key for the original image
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const key = `${category}/${timestamp}-${safeName}`;

    // Upload original image
    const originalResult = await uploadStyleSwiperImage(file, category, {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      category,
    });

    // Process and generate variants
    const variants = await ImageProcessor.processImage(
      validation.optimized!,
      key,
      variantType as any
    );

    // Generate mobile optimized versions
    const mobileVariants = await ImageProcessor.generateMobileOptimized(
      validation.optimized!,
      key
    );

    // Extract colors for theming
    const colors = await ImageProcessor.extractColors(validation.optimized!);

    // Generate blur placeholder
    const { placeholder, aspectRatio } = await ImageProcessor.generateBlurPlaceholder(
      validation.optimized!
    );

    // Perform AI fashion analysis
    let fashionAnalysis = null;
    if (originalResult.url) {
      try {
        fashionAnalysis = await FashionAnalyzer.analyzeImage(originalResult.url);
        // console.log('Fashion analysis completed:', {
        //   category: fashionAnalysis.category,
        //   style: fashionAnalysis.style,
        //   formality: fashionAnalysis.formality,
        //   styleScore: fashionAnalysis.styleScore
        // });
      } catch (error) {
        console.error('Fashion analysis failed:', error);
      }
    }

    return NextResponse.json({
      success: true,
      original: originalResult,
      variants: [...variants, ...mobileVariants],
      metadata: {
        ...validation.metadata,
        colors,
        placeholder,
        aspectRatio,
        category,
        uploadedAt: new Date().toISOString()
      },
      analysis: fashionAnalysis
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}