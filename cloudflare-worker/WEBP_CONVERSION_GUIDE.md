# WebP Conversion Guide

## 🎯 Convert Your Bundle PNG Images to WebP

Your worker now has built-in PNG → WebP conversion! This will create optimized WebP versions alongside your PNG files.

---

## 🚀 Quick Start: Convert Bundle-01

### Test First (Dry Run)
```bash
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/&dryrun=true&limit=5"
```

### Convert Bundle-01 Images
```bash
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/&quality=80&limit=25"
```

This will:
- Convert all 25 PNG images to WebP format
- Upload WebP versions to the same folder
- Show file size savings (typically 25-35% smaller)
- Skip files that already exist as WebP

---

## 📋 All Available Endpoints

### 1. **Convert Single Image**
```bash
# Convert specific image
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/convert-to-webp?path=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-red.png&quality=80"

# Dry run first
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/convert-to-webp?path=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-red.png&dryrun=true"
```

### 2. **Batch Convert All Bundle Images**
```bash
# Convert all bundle images (all categories)
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/&quality=85&limit=100"

# Convert specific bundle category
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/&quality=80&limit=50"
```

### 3. **Convert with Custom Settings**
```bash
# High quality (larger files, better quality)
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/&quality=90"

# Balanced (recommended)
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/&quality=80"

# Smaller files (lower quality)
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/&quality=70"
```

---

## ⚙️ Parameters

| Parameter | Description | Default | Example |
|-----------|-------------|---------|---------|
| `prefix` | Folder path to process | `suitshirttie/kct-products/` | `Bundles-Augest-2025/Bundles-01/` |
| `quality` | WebP quality (0-100) | `80` | `85` |
| `limit` | Max files per request | `50` | `25` |
| `dryrun` | Test without converting | `false` | `true` |
| `skipexisting` | Skip if WebP exists | `true` | `false` |

---

## 📊 Example Response

```json
{
  "prefix": "suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/",
  "quality": 80,
  "processed": 25,
  "converted": [
    {
      "originalPath": "suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-red.png",
      "webpPath": "suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-red.webp",
      "originalSize": 2198000,
      "webpSize": 1538000,
      "savings": 30,
      "quality": 80
    }
  ],
  "summary": {
    "totalProcessed": 25,
    "converted": 25,
    "failed": 0,
    "skipped": 0,
    "totalSavings": 16500000,
    "averageSavings": 28
  }
}
```

---

## 🔄 Complete Bundle Conversion Process

### Step 1: Test with Bundle-01
```bash
# 1. Dry run to see what will be converted
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/&dryrun=true"
```

### Step 2: Convert Bundle-01
```bash
# 2. Actually convert Bundle-01
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/&quality=80"
```

### Step 3: Verify Conversion
```bash
# 3. Check that WebP URLs work
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/bundle-urls-webp?category=bundles-august-2025"
```

### Step 4: Convert All Bundles
```bash
# 4. Convert all other bundle categories
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-02/&quality=80"
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bow-Tie/&quality=80"
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Dress%20Shirts/&quality=80"
# ... etc for each category
```

---

## 💡 Best Practices

### Quality Settings
- **Quality 90-95**: For hero images, product detail shots
- **Quality 80-85**: For product listings, general use (recommended)
- **Quality 70-75**: For thumbnails, quick loading

### Batch Size
- **25 files**: Good for testing
- **50 files**: Recommended batch size
- **100 files**: Maximum recommended (avoid timeouts)

### Monitoring
```bash
# Check progress
watch -n 5 'curl -s "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/Bundles-Augest-2025/Bundles-01/&dryrun=true" | jq ".summary"'
```

---

## 🔧 Advanced Usage

### Convert All Bundle Categories
```bash
#!/bin/bash
CATEGORIES=(
  "Bundles-Augest-2025/Bundles-01/"
  "Bundles-Augest-2025/Bundles-02/"
  "Bundles-Augest-2025/Bundles-03/"
  "Bow-Tie/"
  "Dress%20Shirts/"
  "Fall%20Wedding%20Bundles/"
  "Spring%20Wedding%20Bundles/"
  "Summer%20Wedding%20Bundles/"
  "Tuxedo-Bundles/"
  "casual-bundles/"
)

for category in "${CATEGORIES[@]}"; do
  echo "Converting: $category"
  curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/$category&quality=80&limit=50"
  echo "Completed: $category"
  sleep 2
done
```

### Handle Large Collections with Pagination
```bash
# If you get hasMore: true in response, use the cursor
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/batch-convert-webp?prefix=suitshirttie/kct-products/&cursor=CURSOR_FROM_PREVIOUS_RESPONSE&limit=50"
```

---

## 📈 Expected Results

After conversion:
- **File sizes**: 25-35% smaller
- **Loading speed**: 20-30% faster
- **SEO improvement**: Better Core Web Vitals scores
- **Bandwidth savings**: Significant cost reduction

---

## ✅ Verification

After conversion, your WebP URLs will work:
```bash
# Test a specific WebP URL
curl -I "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-products/Bundles-Augest-2025/Bundles-01/black-suit-3p-red.webp"

# Get all WebP URLs
curl "https://kct-r2-supabase-sync.kctmenswear.workers.dev/bundle-urls-webp"
```

---

## 🚨 Important Notes

1. **Conversion is permanent** - WebP files are created alongside PNG files
2. **Original PNG files remain** - They are not deleted
3. **Quality setting is important** - Test with different values
4. **Monitor timeouts** - Use appropriate batch sizes
5. **Check results** - Verify a few conversions manually

Ready to convert all your bundle images to WebP? Start with Bundle-01! 🎉