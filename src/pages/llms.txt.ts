import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.href || siteConfig.url).replace(/\/$/, '');

  const llmsTxt = `
# ${siteConfig.name}

M.P. Public School is located at 9, Ashok Nagar, Indore, Madhya Pradesh. School records supplied for this website identify MP Board and list affiliation number ${siteConfig.affiliationNumber}; contact the office for current recognition and affiliation documents.
The school offers education from Pre-Primary to Class XII. The public information on this site is for the ${siteConfig.academicSession} academic session unless a page says otherwise.
This summary was reviewed on ${siteConfig.policyUpdated}. Confirm current availability, fees, timings, and subject combinations with the school office.

## Key Information
- Location: ${siteConfig.address}
- Contact: ${siteConfig.phones.join(', ')} | ${siteConfig.email}
- School records: MP Board; affiliation number ${siteConfig.affiliationNumber} is listed in the supplied information. Confirm current recognition with the office.
- Working Hours: ${siteConfig.workingHours}

## Important Pages
- Home: ${baseUrl}/
- About Us: ${baseUrl}/about - Learn about the school, campus, and programme.
- Admissions: ${baseUrl}/admissions - Admission information, enquiry form, and document-backed guidance.
- Academics: ${baseUrl}/academics - Curriculum, classes, and academic information.
- Facilities: ${baseUrl}/facilities - Campus infrastructure, activities, and transport guidance.
- Faculty: ${baseUrl}/faculty - Staff information supplied for the website.
- News & Events: ${baseUrl}/news - Published school updates and diary dates.
- Gallery: ${baseUrl}/gallery - Campus, leadership, and school-event media.
- Contact: ${baseUrl}/contact - Office contacts, enquiry form, and location.
- Fee Structure: ${baseUrl}/fee-structure - Published tuition and separate admission charges.
- School Information: ${baseUrl}/disclosure - School identity and available documents.
- Privacy Policy: ${baseUrl}/privacy-policy - Website forms and data handling.
- Terms: ${baseUrl}/terms - Website use and external-service information.
- Cancellation and Refunds: ${baseUrl}/refund-policy - How to request the applicable written terms.

## Machine-readable resources
- LLM JSON summary: ${baseUrl}/llm.json
- Sitemap index: ${baseUrl}/sitemap-index.xml
- Crawler policy: ${baseUrl}/robots.txt
`.trim();

  return new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
