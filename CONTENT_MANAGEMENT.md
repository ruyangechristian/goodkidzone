# Content Management Guide

## Overview

This guide explains how to manage video content across the GoodKid Zone platform using the Content Management Dashboard.

## Access Content Management

1. **Sign In**: First, you must sign in to your account
   - Go to `/signin` and enter your credentials
   - Or click "Sign In" button in the header

2. **Go to Dashboard**: After signing in, visit `/dashboard`

3. **Click Content Management**: Look for the "Content Management" section with a settings icon
   - This takes you to `/admin/content`

## Add Videos

### Step-by-Step Instructions

1. **Select Category**: Choose which category to add content to:
   - **Videos** - Educational videos and tutorials
   - **Short Films** - Short stories and films
   - **Religion** - Religious and values content

2. **Click "Add New Video"** button

3. **Fill in the Form**:
   - **Video Title** (Required): Name of the video
     - Example: "Learn Numbers in Kinyarwanda"
   - **Description** (Optional): Brief description of the content
     - Example: "Learn to count from 1-100 with fun animations"
   - **YouTube URL** (Required): Full URL from YouTube
     - Copy the complete URL from your browser address bar
     - Format: `https://www.youtube.com/watch?v=VIDEO_ID`
     - Also works with: `https://youtu.be/VIDEO_ID`
   - **Duration** (Optional): Video length
     - Example: "10:30" or "12 mins"

4. **Click "Add Video"** to submit

### Example YouTube URLs

- Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Short URL: `https://youtu.be/dQw4w9WgXcQ`
- Embedded: `https://www.youtube.com/embed/dQw4w9WgXcQ`

All formats are supported automatically.

## View Videos

### On Frontend Pages

Once videos are added through the dashboard, they automatically appear on:

- **Videos Page** (`/videos`)
  - Shows all videos from the "Videos" category
  - Falls back to default videos if no custom videos exist
  - Displays video title, description, duration, and thumbnail

- **Short Films Page** (`/short-films`)
  - Shows all videos from the "Short Films" category
  - Displays "Most Popular" and "Recently Added" sections
  - Each film has an image thumbnail and description

- **Religion Page** (`/religion`)
  - Shows all videos from the "Religion" category
  - Features religious and values content
  - Heart icon indicates religious/values content

## Delete Videos

1. **In Content Management Dashboard**: Scroll to the video you want to delete
2. **Click "Delete" button** (red trash icon)
3. **Confirm deletion** when prompted
4. Video is immediately removed from the system

## Video Thumbnail

- **Automatic**: Thumbnail is automatically generated from YouTube
  - Uses the highest quality available thumbnail from YouTube
  - Format: `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg`

- **How it Works**: The system extracts the video ID from the YouTube URL and generates the thumbnail link

## How Videos Appear to Users

### Desktop View
- Videos displayed in a grid layout (3 columns on large screens)
- Each video shows:
  - Thumbnail image with play icon overlay
  - Video title
  - Description
  - Duration
  - "Watch Now" button linking to YouTube

### Mobile View
- Responsive grid layout
- Single column on small screens
- Two columns on tablets
- Three columns on desktops

## API Endpoints (Technical Reference)

### Get Videos by Category
```
GET /api/videos?category=videos
GET /api/videos?category=short-films
GET /api/videos?category=religion
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1704067200000,
      "title": "Video Title",
      "description": "Video description",
      "youtubeUrl": "https://www.youtube.com/watch?v=...",
      "videoId": "dQw4w9WgXcQ",
      "duration": "10:30",
      "category": "videos",
      "image": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Add Video
```
POST /api/videos
Content-Type: application/json
Authorization: Cookie (authToken)

{
  "title": "Video Title",
  "description": "Optional description",
  "youtubeUrl": "https://www.youtube.com/watch?v=...",
  "duration": "10:30",
  "category": "videos"
}
```

### Delete Video
```
DELETE /api/videos/{id}?category=videos
Authorization: Cookie (authToken)
```

## Troubleshooting

### Video Not Showing Up
1. **Check Category**: Make sure you added it to the correct category
2. **Verify YouTube URL**: 
   - Copy the full URL from your browser
   - Ensure it contains a valid YouTube video ID
   - Check if the video is publicly accessible

### YouTube URL Invalid
- Error: "Invalid YouTube URL"
- Solution: Use full URL format like:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - Not short links or custom URLs

### Thumbnail Not Loading
- YouTube must be accessible (not blocked)
- Video must be publicly available on YouTube
- Clear browser cache if needed

### Can't Access Dashboard
- Must be signed in first
- Session may have expired - sign in again
- Check browser cookies are enabled

## Best Practices

1. **Use Clear Titles**: Help users understand the content at a glance
2. **Add Descriptions**: Explain the video content briefly
3. **Include Duration**: Help users plan their viewing time
4. **Public Videos**: Ensure YouTube videos are set to public/unlisted
5. **Quality Content**: Verify the video plays correctly before adding

## Future Enhancements

Potential features for future updates:
- Database storage (currently uses in-memory storage)
- Bulk upload functionality
- Video analytics and view counts
- Categorization tags
- Video search and filtering
- Admin user management
- Video scheduling/publishing
