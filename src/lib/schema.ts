import { siteConfig } from '@/config/site';

export const getBaseOrganization = () => {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'School'],
    '@id': 'https://mppublicschool.online/#school',
    name: siteConfig.name,
    alternateName: ['MP Public School', 'M.P. Public School Indore'],
    url: 'https://mppublicschool.online',
    logo: {
      '@type': 'ImageObject',
      url: 'https://mppublicschool.online/Mppublic_logo.jpeg',
    },
    image: `${siteConfig.url}/mpps_front.jpeg`,
    description: 'MP Board-affiliated school at 9, Ashok Nagar, Indore, with classes from Pre-Primary to Class XII.',
    telephone: siteConfig.phones[0],
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.streetAddress,
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
    sameAs: Object.values(siteConfig.socialLinks),
    areaServed: {
      '@type': 'City',
      name: 'Indore',
    },
    contactPoint: siteConfig.phones.map(telephone => ({
      '@type': 'ContactPoint',
      telephone,
      contactType: 'School office and admissions',
      email: siteConfig.email,
    })),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Affiliation',
      identifier: siteConfig.affiliationNumber,
      recognizedBy: {
        '@type': 'Organization',
        name: 'MP Board'
      }
    }
  };
};

export const getFAQPage = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
});

export const getWebPage = (title: string, description: string, url: string, type = 'WebPage') => {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url: url,
    name: title,
    description: description,
    isPartOf: {
      '@id': 'https://mppublicschool.online/#website'
    },
    about: {
      '@id': 'https://mppublicschool.online/#school'
    }
  };
};

export const getBreadcrumbList = (items: { name: string; item: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
};
