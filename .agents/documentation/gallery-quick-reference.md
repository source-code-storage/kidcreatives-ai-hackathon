# Gallery Feature - Quick Reference Guide

## For Developers

### File Structure
```
src/
├── components/gallery/
│   ├── GalleryView.tsx       # Main gallery component
│   ├── GalleryCard.tsx       # Individual creation card
│   ├── GalleryHeader.tsx     # Header with title and close
│   ├── EmptyGalleryState.tsx # Empty state UI
│   └── index.ts              # Exports
├── hooks/
│   └── useGallery.ts         # Gallery state management
├── lib/
│   ├── galleryStorage.ts     # localStorage CRUD
│   └── thumbnailGenerator.ts # Image thumbnail generation
└── types/
    └── GalleryTypes.ts       # Type definitions
```

### Key Components

#### useGallery Hook
```typescript
const { items, isLoading, error, addToGallery, removeFromGallery, refreshGallery } = useGallery()
```

#### GalleryView Component
```typescript
<GalleryView onClose={() => setShowGallery(false)} />
```

#### Save to Gallery (TrophyPhase)
```typescript
const handleSaveToGallery = async () => {
  const thumbnail = await generateThumbnail(refinedImage, 300)
  addToGallery({
    refinedImage,
    originalImage,
    promptStateJSON,
    intentStatement,
    stats,
    certificatePDF: pdfBase64,
    thumbnail
  })
}
```

### localStorage Schema
```typescript
// Key: 'kidcreatives_gallery'
// Value: GalleryItem[]

interface GalleryItem {
  id: string              // UUID
  createdAt: number       // timestamp
  refinedImage: string    // base64
  originalImage: string   // base64
  promptStateJSON: string // JSON string
  intentStatement: string
  stats: TrophyStats
  certificatePDF: string  // base64 PDF
  thumbnail: string       // base64 thumbnail
}
```

### API Reference

#### galleryStorage.ts
```typescript
saveToGallery(item: Omit<GalleryItem, 'id' | 'createdAt'>): void
getGalleryItems(): GalleryItem[]
deleteFromGallery(id: string): void
clearGallery(): void
```

#### thumbnailGenerator.ts
```typescript
generateThumbnail(base64Image: string, maxWidth: number = 300): Promise<string>
```

### Error Handling

#### localStorage Quota Exceeded
```typescript
try {
  saveToGallery(item)
} catch (error) {
  // Error: "Gallery is full! Delete some creations to save more."
}
```

#### Malformed Data
```typescript
// Automatically recovers by clearing corrupted data
const items = getGalleryItems() // Returns [] if data is corrupted
```

### Testing

#### Manual Test
```bash
# Start dev server
npm run dev

# Open browser
http://localhost:5173

# Clear localStorage
localStorage.clear()

# Complete workflow and save to gallery
# Verify gallery icon, badge, and all CRUD operations
```

#### Check localStorage
```javascript
// In browser console
localStorage.getItem('kidcreatives_gallery')
JSON.parse(localStorage.getItem('kidcreatives_gallery'))
```

### Common Issues

#### Gallery Icon Not Showing Badge
- Check if `useGallery()` hook is called in App.tsx
- Verify `galleryItems.length > 0`
- Check console for errors

#### Save Button Not Working
- Verify all required data is present (refinedImage, originalImage, etc.)
- Check console for thumbnail generation errors
- Verify PDF was generated successfully

#### Thumbnails Not Loading
- Check if base64 image format is correct
- Verify Canvas API is supported
- Check console for errors

#### localStorage Full
- Check current usage: `JSON.stringify(localStorage).length`
- Delete old creations to free space
- Consider implementing pagination

### Performance Tips

1. **Thumbnail Size**: Keep at 300px width for optimal balance
2. **JPEG Quality**: 0.7 quality provides good compression
3. **Lazy Loading**: Full images only load in modal
4. **Batch Operations**: Avoid multiple saves in quick succession

### Migration to Supabase

When ready to migrate:

1. Create database schema (see implementation report)
2. Create storage buckets
3. Replace `galleryStorage.ts` with Supabase client
4. Update `useGallery` hook to use Supabase queries
5. Implement migration script for existing localStorage data

### Debugging

#### Enable Verbose Logging
```typescript
// In galleryStorage.ts
console.log('Saving to gallery:', item)
console.log('Current items:', getGalleryItems())
```

#### Check localStorage Size
```javascript
// In browser console
const size = new Blob([localStorage.getItem('kidcreatives_gallery')]).size
console.log('Gallery size:', (size / 1024 / 1024).toFixed(2), 'MB')
```

#### Clear Gallery
```javascript
// In browser console
localStorage.removeItem('kidcreatives_gallery')
```

---

## For Users (Children)

### How to Save Your Creation

1. **Complete Your Artwork**
   - Upload your drawing
   - Answer all the questions
   - Generate your AI art
   - Make any edits you want
   - Reach the Trophy screen

2. **Enter Your Name**
   - Type your name when asked
   - Click "Next"

3. **Save to Gallery**
   - Click the green "Save to Gallery" button
   - Wait for Sparky to say "Saved to your gallery!"
   - The button will show a checkmark ✓

### How to View Your Gallery

1. **Open Gallery**
   - Look for the green button in the top-right corner
   - It shows a picture icon
   - Click it to open your gallery

2. **See Your Creations**
   - All your saved artworks appear as cards
   - Each card shows a small picture and the date

3. **View Details**
   - Click the "View" button on any card
   - See your full artwork and all the stats
   - Download your image or certificate

### How to Delete a Creation

1. **Find the Creation**
   - Open your gallery
   - Find the artwork you want to delete

2. **Click Delete**
   - Click the red trash can button
   - Confirm you want to delete it
   - The creation will disappear

### Tips

- Save your favorite creations so you can show them to friends!
- Download certificates to print and hang on your wall
- Create lots of artworks to build your collection
- If your gallery gets full, delete old ones to make room

---

## Keyboard Shortcuts

- **Escape**: Close gallery or modal
- **Enter**: Confirm actions (when focused)
- **Tab**: Navigate between buttons

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## Troubleshooting

### "Gallery is full" Error
**Solution**: Delete some old creations to free up space

### Gallery Not Loading
**Solution**: Refresh the page or clear browser cache

### Images Not Showing
**Solution**: Check internet connection and refresh

### Can't Save to Gallery
**Solution**: Make sure you completed all 5 phases first

---

## Contact & Support

For issues or questions:
1. Check browser console for errors (F12)
2. Review manual test checklist
3. Check implementation report for details
4. Refer to plan document for architecture

---

**Last Updated:** January 29, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
