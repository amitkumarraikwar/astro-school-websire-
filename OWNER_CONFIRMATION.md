# Owner confirmation required before final production sign-off

This file records facts that the repository does not establish conclusively. No value below has been guessed or silently promoted to a verified claim.

## 1. Telephone, WhatsApp, and office contact

### Values currently present

- `src/config/site.ts` lists main website phones as `+91 9091929384` and `+91 8989156787`.
- `src/config/site.ts` sets the WhatsApp number to `919091929384` (the same number as `+91 9091929384`).
- `src/config/site.ts` sets the junior branch phone to `+91 9091929384`.
- The supplied school diary PDF (`public/documents/mpps-academic-calendar-2026-27.pdf`) prints `8989002345` for M.P. Public Hr. Sec. School and `9091929384` for M.P. Kids School.
- `CLIENT_INFO_REQUIRED.md` already records that these numbers need confirmation.

### Owner questions

1. Which number(s) are current for the main campus at `9, Ashok Nagar, Indore`?
2. Is `8989002345` the current main-campus number, a historical number, or a number for another branch?
3. Is `9091929384` only for M.P. Kids School, or is it also an official main-campus number?
4. Should WhatsApp continue to use `919091929384`? If not, provide the verified WhatsApp number.
5. Confirm the postal code, office working days, office hours, and whether `support@mppublicschool.online` receives enquiries.
6. Provide the canonical Google Business Profile or Google Maps URL if it differs from the current address search URL.

### Evidence required

An owner-approved contact sheet, current letterhead, current school diary page, or confirmation from the responsible school office.

## 2. MP Board recognition and affiliation

### Values currently present

- `src/config/site.ts` lists `board: "MP Board"` and `affiliationNumber: "532414"`.
- `src/pages/disclosure.astro` says a current recognition or affiliation certificate was not supplied.
- Structured data, `llms.txt`, and `llm.json` now describe the board and number as information listed in supplied records rather than as a verified credential.

### Owner questions

1. Does the school have a current MP Board recognition/affiliation certificate supporting number `532414`?
2. Which classes and academic session does that document cover?
3. May the certificate, UDISE code, or a redacted official reference be published on the website?

### Evidence required

The current certificate or a written confirmation from the school authority. Until then, keep the qualified wording in the site.

## 3. Faculty names, roles, departments, and portraits

### Current source records

- `src/content/faculty/staff.json` lists:
  - Mrs. Shraddha Pardeshi — `Principal` — `Administration` — `MSc.(B.Ed)`.
  - Dilip Budhani — `Director` — `Administration`.
  - Yogita Budhani — `Director` — `Administration`.
- `src/pages/faculty.astro` displays Dilip Budhani as Director and Shraddha Pardeshi as Principal, but does not currently render Yogita Budhani.
- The page now uses the supplied names `Meenakshi Bhatt`, `Sonal Bhadauriya`, `Pranav Bhatnagar`, `Jiyanshi`, and `Chinki Jain`. Earlier hard-coded variants were `Minakshi Bhatt`, `Sonal Bhadoriya`, `Pranay Bhatnagar`, `Jiyanshi Soni`, and `Chinki Verma`.
- The page still contains a manually maintained roster beyond the records in `staff.json`. Its department label is often `Teaching Staff`, while the source JSON commonly uses `Academics`.
- Portrait files are mapped through the `photo` values in `staff.json`; the school must confirm that each portrait belongs to the named person. Names without a supplied portrait intentionally show initials.

### Owner questions

1. Should Yogita Budhani be shown on the public faculty page? If yes, confirm the role and provide an approved portrait if one should be used.
2. Confirm the current roles of Dilip Budhani and Mrs. Shraddha Pardeshi.
3. Confirm that the corrected source names listed above are the people shown in the corresponding portraits.
4. Confirm the current staff roster, department labels, and which manual entries should be removed or added.
5. Confirm the qualification `MSc.(B.Ed)` and any other qualifications before they are displayed as verified credentials.

### Evidence required

An owner-approved staff register, signed/current faculty list, or written confirmation from school management. Do not publish a full name or portrait identity solely because a filename appears to match.

## 4. Admission form and academic streams

- `src/components/sections/InquiryForm.astro` now includes the classes documented in `src/config/fees.ts`, including Pre-Nursery, K.G. I–II, Class X, and Class XII.
- `README.md` records that the external Google Form currently includes a Humanities option, while the supplied fee schedule lists Science and Commerce.

### Owner questions

1. Does the school currently offer Humanities in addition to Science and Commerce?
2. Do the local option labels exactly match the current external Google Form choices and field ID `entry.667920343`?
3. Which classes and streams are accepting enquiries for the current session?

### Evidence required

The current Google Form dropdown and an owner-approved class/stream list.

## 5. Native school app listing

### Repository findings

- The website contains an installable PWA, not a linked native Android or iOS application.
- The PWA is generated from `astro.config.mjs` and is now branded `M.P. Public School` with the verified short name `MPPS` from `src/config/site.ts`.
- The repository contains no verified Google Play URL, Apple App Store URL, Android package ID, iOS bundle identifier, APK, or native-app screenshot.
- The install prompt therefore promotes adding the school website to a device home screen; it does not claim to link to a separate native school app.

### Owner question

If a separate native school app should be promoted, provide the owner-approved app name, canonical store URL, package/bundle identifier, and approved icon/screenshots. Do not add a store link or package identifier based only on an app name.
