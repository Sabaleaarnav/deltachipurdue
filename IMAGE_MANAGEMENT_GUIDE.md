# Image Management Guide - Delta Chi Purdue

**Last Updated:** 2025-10-27

This guide explains how to upload and manage images for your website, which is deployed on Netlify.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [How to Upload Images](#how-to-upload-images)
3. [Adding Images to Different Sections](#adding-images-to-different-sections)
4. [Image Best Practices](#image-best-practices)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

**Where images are stored:** `/assets/images/`

**How to upload:**
1. Go to your website's admin panel: `https://yourdomain.com/admin`
2. Log in with your Netlify Identity credentials
3. Navigate to the section you want to edit (Events, Gallery, Leadership, etc.)
4. Click "Choose an image" or edit existing content
5. Upload your image file
6. Save and publish

---

## How to Upload Images

### Method 1: Using Netlify CMS Admin Interface (RECOMMENDED)

This is the easiest method for non-technical users.

#### Step-by-Step:

1. **Access the Admin Panel**
   - Go to: `https://yourdomain.com/admin` (replace with your actual domain)
   - Or use the "Admin Login" button in the site header

2. **Log In**
   - Use your Netlify Identity credentials
   - If you don't have an account, ask the site administrator to invite you

3. **Navigate to Content**
   - Choose the section from the left sidebar:
     - **Events** → For event photos
     - **Gallery** → For general gallery photos
     - **Leadership** → For member headshots
     - **Fundraising Goals** → (no images needed)
     - **Donor Wall** → (no images needed)
     - **Site Settings** → (no images needed)
     - **Initiatives** → (no images needed)

4. **Add or Edit Content**
   - Click on an existing item to edit, or
   - Click "New [Type]" to create new content

5. **Upload Image**
   - Find the "Photo" or "Image" field
   - Click "Choose an image"
   - Either:
     - **Upload a new file** from your computer, or
     - **Select an existing image** from the media library

6. **Save Changes**
   - Click "Save" (draft mode)
   - Then click "Publish" to make it live
   - Netlify will automatically deploy your changes (takes 1-2 minutes)

---

### Method 2: Direct Git Upload (For Developers)

If you have Git access to the repository:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/deltachipurdue.git
   cd deltachipurdue
   ```

2. **Add images to the folder**
   ```bash
   cp your-image.jpg assets/images/
   ```

3. **Update the JSON content file**
   - Edit the appropriate JSON file in `/content/`
   - Add the image path: `/assets/images/your-image.jpg`
   - Example for an event:
   ```json
   {
     "items": [
       {
         "title": "My Event",
         "date": "2025-11-01",
         "location": "Purdue Campus",
         "description": "Event description here",
         "photo": "/assets/images/your-image.jpg"
       }
     ]
   }
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add event photo"
   git push
   ```

---

## Adding Images to Different Sections

### Leadership Photos

**Location:** Netlify CMS → Leadership

**Instructions:**
1. Go to admin panel → "Leadership"
2. Click on a member's name to edit
3. Scroll to "Photo" field
4. Upload image (recommended: square headshots, 500x500px or larger)
5. Save and publish

**Current Status:** ✅ All 14 members have photos

---

### Event Photos

**Location:** Netlify CMS → Events → [Category]

**Available Categories:**
- Alumni Events
- Brotherhood Events
- Community Service Events
- Philanthropy Events
- Social Events
- Fundraising Events
- Academic Events

**Instructions:**
1. Go to admin panel → "Events"
2. Choose the appropriate category
3. Click existing event to edit, or "New Event" to create
4. Fill in:
   - Title
   - Date (use the date picker)
   - Location
   - Description
   - Photo (click "Choose an image" to upload)
5. Save and publish

**Current Status:**
- ✅ Brotherhood: 1 event with photo
- ✅ Community Service: 1 event with photo
- ⚠️  Alumni: 0 events
- ⚠️  Philanthropy: 0 events
- ⚠️  Social: 0 events
- ⚠️  Fundraising: 0 events
- ⚠️  Academic: 0 events

---

### Gallery Photos

**Location:** Netlify CMS → Gallery

**Instructions:**
1. Go to admin panel → "Gallery"
2. Click on "Gallery Items"
3. Add new item:
   - Title (e.g., "Brotherhood Retreat 2025")
   - Description (optional)
   - Photo (required - click "Choose an image")
4. Save and publish

**Tips:**
- Gallery uses a masonry layout (Pinterest-style)
- Mix of horizontal and vertical photos works best
- Recommended size: 1200px wide (height can vary)

**Current Status:** ✅ 3 items in gallery

---

### Initiatives

**Note:** Initiatives currently don't support images. If you need to add images to initiatives, contact the site administrator.

---

## Image Best Practices

### Image Specifications

| Type | Recommended Size | Format | Max File Size |
|------|------------------|--------|---------------|
| **Leadership Headshots** | 500x500px (square) | JPG/PNG | 500 KB |
| **Event Photos** | 1200x800px (landscape) | JPG | 1 MB |
| **Gallery Photos** | 1200px wide (any height) | JPG | 1 MB |
| **General** | 1920px max width | JPG preferred | 2 MB |

### File Naming

- Use descriptive names: `brotherhood-retreat-2025.jpg` ✅
- Avoid spaces: use hyphens `-` instead
- Avoid special characters: stick to letters, numbers, and hyphens
- Use lowercase: `event-photo.jpg` ✅ not `Event Photo.JPG` ❌

### Image Optimization

Before uploading, optimize your images:

1. **Resize large images**
   - Use tools like:
     - [TinyPNG](https://tinypng.com/) (free, online)
     - [Squoosh](https://squoosh.app/) (free, online)
     - Photoshop, GIMP, or Preview (Mac)

2. **Compress for web**
   - JPG quality: 80-85% is usually sufficient
   - PNG: Use for logos/graphics with transparency
   - Avoid uploading RAW or uncompressed files

3. **Crop appropriately**
   - Leadership: Square crop (1:1 ratio)
   - Events: Landscape crop (3:2 or 16:9 ratio)
   - Gallery: Flexible (but consistent style looks better)

---

## Current Image Inventory

### Available Images (18 total)

All images are located in `/assets/images/`:

**Leadership Headshots (2):**
- `ian-headshot.jpeg` - President Ian Hedges
- `jessie-headshot.jpeg` - House Mom Jessica Richardson

**Officer/Member Photos (16):**
- 14 dated photos from June 2025 (format: `20250627_132405_[hash].jpeg`)
- `image-10-.jpg` - Risk Manager photo
- `img_1137.jpg` - Recruitment Chair photo

**Currently Used:**
- ✅ All 18 images are assigned to leadership members
- ✅ 2 images reused for events (brotherhood, community service)
- ✅ 3 images used in gallery

---

## Image Path Format

When manually editing JSON files, use this format:

```json
{
  "photo": "/assets/images/your-image.jpg"
}
```

**Important Notes:**
- Path starts with `/` (absolute path)
- Path is `/assets/images/` NOT `assets/images/`
- Include the file extension (`.jpg`, `.jpeg`, `.png`)
- Paths are case-sensitive

**Correct Examples:**
```
✅ /assets/images/event-photo.jpg
✅ /assets/images/headshots/john-doe.jpeg
✅ /assets/images/2025/spring-retreat.png
```

**Incorrect Examples:**
```
❌ assets/images/photo.jpg (missing leading /)
❌ /assets/images/Photo.JPG (case mismatch)
❌ /images/photo.jpg (wrong folder)
❌ ../assets/images/photo.jpg (relative path)
```

---

## Troubleshooting

### Problem: Image doesn't appear after upload

**Solutions:**
1. **Check the path** - Make sure it starts with `/assets/images/`
2. **Wait for deployment** - Netlify takes 1-2 minutes to deploy
3. **Hard refresh** - Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
4. **Check file size** - Files over 10 MB may fail to upload
5. **Check file format** - Use JPG, PNG, or GIF only

### Problem: Upload fails in admin panel

**Solutions:**
1. **Check file size** - Keep under 10 MB
2. **Check filename** - Remove special characters
3. **Try a different browser** - Chrome works best
4. **Check your connection** - Upload may timeout on slow connections
5. **Contact admin** - Check Netlify Identity permissions

### Problem: Image is blurry or pixelated

**Solutions:**
1. **Upload higher resolution** - Minimum 1200px wide
2. **Don't upscale small images** - Use original size or larger
3. **Check compression** - Don't over-compress (use 80%+ quality)

### Problem: Images don't load on mobile

**Solutions:**
1. **Check responsive CSS** - Images should have `max-width: 100%`
2. **Test on different devices** - Some CDN issues may affect mobile
3. **Check lazy loading** - Images have `loading="lazy"` attribute

---

## Image Upload Workflow Summary

```
┌─────────────────────────────────────────┐
│  STEP 1: Access Admin Panel             │
│  https://yourdomain.com/admin           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  STEP 2: Choose Content Section         │
│  Events, Gallery, Leadership, etc.      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  STEP 3: Edit or Create New Item        │
│  Click existing item or "New"           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  STEP 4: Upload Image                   │
│  Click "Choose an image" → Upload       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  STEP 5: Save and Publish               │
│  Changes appear in 1-2 minutes          │
└─────────────────────────────────────────┘
```

---

## Need More Help?

### Resources

- **Netlify CMS Docs:** https://decapcms.org/docs/
- **Image Optimization:** https://squoosh.app/
- **Netlify Support:** https://docs.netlify.com/

### Contact

For technical issues or questions:
- **President:** Ian Hedges - ihedges@purdue.edu
- **VP:** Aarnav Sabale - asabale@purdue.edu
- **Alumni Relations:** alumni@deltachipurdue.org

---

**Last Updated:** 2025-10-27
**Version:** 1.0
