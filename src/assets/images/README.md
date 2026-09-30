# Image Assets Directory

This directory is intended for all the optimized images used across the site via `astro:assets`. 
Currently, tasteful gradient placeholders with the school logo watermark are used in the UI.

Please replace or provide the following real photos (and update the component imports):

1. **`principal-portrait.jpg`**
   - Location: `src/components/sections/PrincipalMessage.astro`
   - Ideal Aspect Ratio: 4:5 (e.g. 800x1000px)
   - Description: Professional portrait of the Principal.

2. **`campus-welcome.jpg`**
   - Location: `src/components/sections/AboutPreview.astro`
   - Ideal Aspect Ratio: 4:3 (e.g. 1200x900px)
   - Description: High-quality photo of the school building or campus entrance.

3. **`news-cbse-results.jpg`**, **`news-smart-classrooms.jpg`**, etc.
   - Location: `src/content/news/` and `src/components/sections/NewsEventsPreview.astro`
   - Ideal Aspect Ratio: 16:9 (e.g. 1280x720px)
   - Description: Featured images for news and announcements.

4. **Gallery Images**
   - Location: `src/content/gallery/`
   - Ideal Aspect Ratio: Various (Grid layout handles mixed ratios, but 4:3 and 16:9 work best)
   - Description: High-quality photos of school events, sports, and activities.
