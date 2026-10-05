import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site?.href || 'https://mppublicschool.online/';

  const llmsTxt = `
# ${siteConfig.name}

M.P. Public School is an MP Board-affiliated school located at 9, Ashok Nagar, Indore, Madhya Pradesh.
We offer classes from Pre-Primary to Senior Secondary, focusing on holistic development, academic excellence, and modern infrastructure.

## Key Information
- Location: ${siteConfig.address}
- Contact: ${siteConfig.phones.join(', ')} | ${siteConfig.email}
- Affiliation: MP Board (Affiliation No: ${siteConfig.affiliationNumber})
- Working Hours: ${siteConfig.workingHours}

## Important Pages
- Home: ${baseUrl}
- About Us: ${baseUrl}about - Learn about our history, mission, and vision.
- Admissions: ${baseUrl}admissions - Admission process, criteria, and forms.
- Academics: ${baseUrl}academics - Information about our curriculum, boards, and classes offered.
- Facilities: ${baseUrl}facilities - Campus infrastructure including labs, library, and sports.
- Faculty: ${baseUrl}faculty - Meet our experienced teaching staff.
- News & Events: ${baseUrl}news - Latest announcements and school events.
- Gallery: ${baseUrl}gallery - Photos of our campus and activities.
- Contact: ${baseUrl}contact - Get in touch with us and find our location.
- Fee Structure: ${baseUrl}fee-structure - Published tuition and separate admission charges.
- School Information: ${baseUrl}disclosure - School identity and available documents.
- Privacy Policy: ${baseUrl}privacy-policy - Website forms and data handling.
- Cancellation and Refunds: ${baseUrl}refund-policy - How to request the applicable written terms.
`.trim();

  return new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
