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
  description: 'School at 9, Ashok Nagar, Indore, offering classes from Pre-Primary to Class XII. Affiliated to MP Board (affiliation no. 532414). Run by Mother Parvati Educational Society.',
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
    status: 'Affiliated to MP Board, affiliation no. 532414.',
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
