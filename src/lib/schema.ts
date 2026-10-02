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
    image: 'https://mppublicschool.online/og-image.jpg',
    description: 'A premier MP Board-affiliated school in Indore, Madhya Pradesh, providing quality education from Pre-Primary to Senior Secondary.',
    telephone: siteConfig.phones[0],
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.split(',')[0].trim(),
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      postalCode: '452001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.7196',
      longitude: '75.8577',
    },
    sameAs: Object.values(siteConfig.socialLinks),
    areaServed: {
      '@type': 'City',
      name: 'Indore',
    },
    foundingDate: siteConfig.establishedYear.toString(),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '15:00',
    },
    // Only include credential/affiliation if confirmed, here we use the placeholder
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Affiliation',
      recognizedBy: {
        '@type': 'Organization',
        name: 'MP Board'
      }
    }
  };
};

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
