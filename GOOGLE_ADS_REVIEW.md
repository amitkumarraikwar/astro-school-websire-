# Website findings and Google Ads appeal preparation

Review date: 5 October 2026. Domain: `https://mppublicschool.online`.

These changes improve school-information accuracy, enquiry functionality, and destination usability. They do not establish the reason for the suspension or guarantee that Google will reinstate the account. Obtain the exact suspension notice before preparing the appeal.

## Live-site finding

At review time the live domain served a different website from this Astro project, with Next.js image routes. It described the school as CBSE-affiliated in the footer and page title. The supplied school record identifies **MP Board, affiliation number 532414**. The live homepage also included claims about its history, global exchanges, and facilities that the supplied records do not establish.

An AdsBot-Google request reached the live homepage with HTTP 200 and redirected to the `www` host. This one request does not verify every landing page, mobile crawler, location, or hosting rule. Deploy this Astro build to the intended domain, or apply the corresponding corrections to the actual deployed project, before describing these changes as live in an appeal.

The follow-up review confirmed Vercel behind Cloudflare. Read-only desktop and mobile AdsBot requests to eight important pages still received the old site's CBSE claims. `/admissions` redirected to `/admissions/apply`, whose delivered HTML initially contained “Loading…” rather than the application content. The live refund page also promised refund conditions and a 15–30-working-day timeline that the supplied school documents do not establish. These observations do not identify the account suspension reason; a client-rendered page may provide additional content after JavaScript runs.

## Sources used

| Source | Information used |
| --- | --- |
| `school related informations/documents.docx` | MP Board, affiliation number 532414, Ashok Nagar campus, office hours, contact numbers, email addresses, campus area, infrastructure |
| `public/documents/mpps-academic-calendar-2026-27.pdf` | Full school name, address 9 Ashok Nagar, junior branch, uniform and houses, annual results for 2025–26, calendar dates for 2026–27 |
| Supplied 2026–2027 fee workbook, visible sheets “Final For New Student Part A” and “Final For New Student Part A VI” | Undiscounted yearly tuition, separate new-admission charges, fee periods, transport arrangements, and published amenities |
| Supplied staff information and existing school-provided portraits | Staff and school leadership |
| Public school Google Forms | Form availability, published submission endpoints, field IDs, required fields, and class choices |

No recognition certificate was supplied for publication or independently validated. The documents contain conflicting telephone numbers and differing campus/shift fee sheets; the website explains the applicable sources and directs enquiries to the office.

## Changes made in this project

- Restored page titles, descriptions, mobile viewport metadata, canonical URLs, social metadata, and structured data. Removed invented map coordinates, postal code, and founding date from school schema.
- Consistently identified the school as MP Board; removed the conflicting static CBSE PWA manifest.
- Replaced unsupported history, awards, enrolment statistics, school-wide result rates, coaching/stream claims, and facility specifications with document-backed information.
- Removed unverified testimonials from the homepage and made sample news/events unpublished by default. Added a school-diary article and sourced calendar dates.
- Corrected the year and class of selected annual result highlights against the diary.
- Made Google Forms submission real, enabled native validation, disclosed the third-party submission and privacy information, and removed the fake contact success alert.
- Added standalone tuition, school-information/documents, and cancellation/refund-information pages. Clarified separate admission charges and additional costs rather than treating discounted tuition as the complete price.
- Updated the Privacy Policy and Terms to reflect the actual forms, maps, browser storage, and absence of website checkout or installed advertising trackers.
- Fixed school directions, telephone links, gallery links, desktop keyboard navigation, and the mobile menu.
- Explicitly allowed AdsBot-Google and AdsBot-Google-Mobile in `robots.txt`, including ad landing-page query parameters, and excluded offline/error pages from the sitemap.
- Replaced the heavyweight homepage 3D island with a school-provided campus image and changed page caching to network-first.

## Local verification

- `npm run check`: passed with no errors or warnings; two deprecation hints remain in the unused 3D component.
- `npm run build`: passed and generated 17 pages.
- Chromium checks: 15 public pages, 28 internal links/assets, desktop and mobile layout, menu open/close and keyboard behaviour, valid metadata and JSON-LD, and genuine 404 responses for unknown and unpublished routes.
- Automated accessibility checks: no reported violations for the 15 desktop pages and five mobile pages checked against WCAG A/AA rules. Automated checks are not a complete accessibility certification.
- Form checks: browser validation and two intercepted POST requests matched the configured Google Forms fields. No test enquiry was delivered to the school; staff receipt still needs confirmation.
- Text inspection: no suspicious invisible Unicode found in the inspected source and documentation files.

Repeatable deployment checks are available through `npm run verify` and `npm run audit:live`. The build audit covers generated pages, local assets and anchors, published school information, crawler rules, sitemap contents, and the 19 migration redirects in `vercel.json`. Vercel runs this verification before publishing the build. The live audit checks desktop and mobile crawler responses; its findings describe differences from this Astro project, not an official Google policy assessment.

These checks cover the local build, not the currently deployed website.

## Complete before appealing

1. **Identify the suspension reason.** Website fixes cannot resolve billing, identity-verification, account-access, or other account-level problems by themselves.
2. **Deploy the corrections.** Replace old output fully, clear stale caches, and check the actual final URLs and sitelinks. Add real same-domain server redirects for previous routes where needed. Verify HTTPS, HTTP status codes, and visitor/AdsBot access without different content or login challenges.
3. **Confirm school details.** Obtain current recognition/affiliation evidence, the school operator's legal identity, current fee/concession and refund terms, and confirmed contact details. Match advertiser verification and billing records to the real school/operator relationship.
4. **Confirm enquiry handling.** Have the school submit an agreed test enquiry and confirm it appears in its Google Forms response records. Endpoint and field checks alone do not prove staff receive or read responses. Correct the external form's unconfirmed Humanities option.
5. **Review the ads.** Use current classes and available services. Avoid CBSE claims unless supported by valid current records, expired concessions, invented achievements, guaranteed results, and urgency claims without a real deadline. Suggested final URL: `https://mppublicschool.online/admissions`.
6. **Appeal the existing account.** Use the suspension notification's appeal flow. Give the exact policy reason, accurate school/operator details, the deployed changes with page URLs and dates, and supporting documents. Resolve verification or billing requests where applicable. Submit one appeal at a time and wait for the decision before repeating it.

Google says related or newly created accounts may also be suspended. Work through the existing account's reinstatement process rather than opening a replacement account to bypass the suspension.

## Appeal statement framework

Use this only after confirming the facts and completing deployment; it is not a statement that the work is already live:

> We request a review of the suspension of our school's existing Google Ads account. The suspension notice cites [exact policy reason]. The advertiser is [verified legal entity and its relationship to the school]. Our website is [live domain]. On [deployment date], we corrected [specific issues relevant to the notice]. The school information, contacts, tuition information, privacy details, and enquiry pages are available at [verified live URLs]. Supporting records are [identify current documents]. We have addressed the account-level requests as follows: [accurate details]. Please review our account and let us know if further evidence is required.

## Official guidance

- [Misrepresentation](https://support.google.com/adspolicy/answer/6020955?hl=en)
- [Destination requirements](https://support.google.com/adspolicy/answer/6368661?hl=en)
- [Google Ads account suspensions and appeals](https://support.google.com/google-ads/answer/9841640?hl=en)

Consult the suspension notice and current Google guidance when filing. Extra policy pages are not a substitute for accurate claims, a functioning destination, or advertiser verification.
