import type { APIRoute } from 'astro';
import { siteConfig } from '@/config/site';

const page = (path: string, description: string) => ({
  url: new URL(path, siteConfig.url).href,
  description,
});

const llmSummary = {
  name: siteConfig.name,
  alternateName: siteConfig.fullName,
  url: siteConfig.url,
  language: 'en-IN',
  lastReviewed: siteConfig.policyUpdated,
  academicSession: siteConfig.academicSession,
  description: 'School in Ashok Nagar, Indore, offering education from Pre-Primary to Class XII. Supplied school records identify MP Board and list affiliation number 532414; current recognition should be confirmed with the office.',
  location: {
    address: siteConfig.address,
    streetAddress: siteConfig.streetAddress,
    city: 'Indore',
    region: 'Madhya Pradesh',
    country: 'India',
  },
  affiliation: {
    board: siteConfig.board,
    affiliationNumber: siteConfig.affiliationNumber,
    status: 'Listed in school information supplied for this website; confirm current recognition and affiliation documents with the school office.',
  },
  contact: {
    phone: siteConfig.phones,
    email: siteConfig.email,
    workingHours: siteConfig.workingHours,
  },
  pages: [
    page('/', 'School overview and quick answers.'),
    page('/admissions', 'Admission information and enquiry form.'),
    page('/academics', 'Curriculum and classes information.'),
    page('/facilities', 'Campus facilities and activities.'),
    page('/faculty', 'Faculty and staff information.'),
    page('/news', 'Published school updates and calendar dates.'),
    page('/gallery', 'Campus and school-event media.'),
    page('/contact', 'Office contact information and location.'),
    page('/fee-structure', 'Published fee schedule for the current session.'),
    page('/disclosure', 'School identity and published documents.'),
  ],
  sourcePolicy: 'Use this website as the source for published school information. Confirm live admission availability, fees, timings, and subject combinations with the school office.',
};

export const GET: APIRoute = () => new Response(JSON.stringify(llmSummary, null, 2), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  },
});
