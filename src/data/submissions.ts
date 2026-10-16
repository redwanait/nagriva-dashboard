import type { IconName } from '../components/Icon'
import type { Submission, SubmissionCategoryId } from '../types'

export interface SubmissionCategory {
  id: SubmissionCategoryId
  table: string
  label: string
  description: string
  icon: IconName
}

export const submissionCategories: SubmissionCategory[] = [
  {
    id: 'inquiries',
    table: 'inquiries',
    label: 'Start with Nagriva',
    description: 'Project requests submitted through the /start page.',
    icon: 'send',
  },
  {
    id: 'project_inquiries',
    table: 'project_inquiries',
    label: 'Find Your Project',
    description:
      'Requests submitted through the Project Finder modal on the Portfolio page.',
    icon: 'compass',
  },
  {
    id: 'call_bookings',
    table: 'call_bookings',
    label: 'Book a Free Call',
    description: 'Free call booking requests.',
    icon: 'phone',
  },
]

export const inquiries: Submission[] = [
  {
    id: 'inq-1042',
    categoryId: 'inquiries',
    name: 'Aarav Mehta',
    phone: '+91 98765 43210',
    email: 'aarav.mehta@example.com',
    summary: 'Website redesign with a more premium, cleaner marketing site.',
    status: 'New',
    createdAt: '2026-10-15T09:24:00',
    fields: [],
    inquiry: {
      need: 'Website redesign',
      projectId: 'PRJ-1042',
      budget: '$4,000 - $6,000',
      timeline: '2 - 3 months',
      company: 'Mehta Consulting',
      contactMethod: 'WhatsApp',
      about:
        'We are looking to refresh our marketing site with a cleaner, more premium look. Need help with branding direction and a full front-end rebuild.',
    },
    notes: [
      {
        id: 'n-1',
        text: 'Referred by an existing client. High intent, replied within an hour.',
        createdAt: '2026-10-15T10:02:00',
      },
    ],
  },
  {
    id: 'inq-1041',
    categoryId: 'inquiries',
    name: 'Priya Nair',
    phone: '+91 90000 11223',
    email: 'priya.nair@brightlabs.io',
    summary: 'Companion mobile app for an existing web platform.',
    status: 'Contacted',
    createdAt: '2026-10-14T15:40:00',
    fields: [],
    inquiry: {
      need: 'Mobile app',
      budget: '$12,000+',
      timeline: 'Flexible',
      company: 'Bright Labs',
      contactMethod: 'Email',
      about:
        'We need a companion app for our existing web platform. Looking for design and development in phases.',
    },
    notes: [],
  },
  {
    id: 'inq-1040',
    categoryId: 'inquiries',
    name: 'Rahul Sharma',
    phone: '+91 98111 22334',
    email: 'rahul@sharmafinance.com',
    summary: 'Content strategy and technical SEO audit for a finance blog.',
    status: 'In Discussion',
    createdAt: '2026-10-13T11:15:00',
    fields: [],
    inquiry: {
      need: 'SEO & content',
      projectId: 'PRJ-1040',
      budget: '$1,500 - $2,500',
      timeline: 'Ongoing retainer',
      company: 'Sharma Finance',
      contactMethod: 'Phone call',
      about:
        'Organic traffic has plateaued. Want a content strategy and technical SEO audit for our finance blog.',
    },
    notes: [
      {
        id: 'n-2',
        text: 'Call scheduled for Thursday. Prepare a sample content calendar.',
        createdAt: '2026-10-13T12:30:00',
      },
      {
        id: 'n-3',
        text: 'Sent competitor analysis deck.',
        createdAt: '2026-10-14T09:10:00',
      },
    ],
  },
  {
    id: 'inq-1039',
    categoryId: 'inquiries',
    name: 'Emily Carter',
    phone: '+1 415 555 0198',
    email: 'emily.carter@northwind.co',
    summary: 'Full rebrand after a merger, print and digital rollout.',
    status: 'Proposal Sent',
    createdAt: '2026-10-12T18:05:00',
    fields: [],
    inquiry: {
      need: 'Brand identity',
      budget: '$8,000 - $10,000',
      timeline: '6 weeks',
      company: '',
      contactMethod: 'Email',
      about:
        'Rebranding after a merger. Need logo, guidelines, and rollout assets across print and digital.',
    },
    notes: [],
  },
  {
    id: 'inq-1038',
    categoryId: 'inquiries',
    name: 'Vikram Singh',
    phone: '+91 99887 76655',
    email: 'vikram@singhlogistics.in',
    summary: 'Internal CRM to track shipments and clients with alerts.',
    status: 'Won',
    createdAt: '2026-10-10T08:45:00',
    fields: [],
    inquiry: {
      need: 'Custom CRM',
      projectId: 'PRJ-1038',
      budget: '$10,000+',
      timeline: '4 months',
      company: 'Singh Logistics',
      contactMethod: 'WhatsApp',
      about:
        'Want an internal dashboard to track shipments and clients. Needs WhatsApp notifications.',
    },
    notes: [
      {
        id: 'n-4',
        text: 'Contract signed. Kickoff booked for Oct 20.',
        createdAt: '2026-10-11T14:00:00',
      },
    ],
  },
  {
    id: 'inq-1037',
    categoryId: 'inquiries',
    name: 'Sofia Rossi',
    phone: '+39 340 555 1122',
    email: 'sofia.rossi@atelierno.it',
    summary: 'Small fashion brand storefront, flexible timeline.',
    status: 'Lost',
    createdAt: '2026-10-08T13:20:00',
    fields: [],
    inquiry: {
      need: 'E-commerce store',
      budget: '$3,000 - $5,000',
      timeline: '',
      company: '',
      contactMethod: '',
      about:
        'Small fashion brand wants a storefront. Comparing a few agencies, timeline is flexible.',
    },
    notes: [
      {
        id: 'n-5',
        text: 'Went with an in-house solution. Follow up in 3 months.',
        createdAt: '2026-10-09T10:00:00',
      },
    ],
  },
  {
    id: 'inq-1036',
    categoryId: 'inquiries',
    name: 'Daniel Okafor',
    phone: '+234 802 555 7788',
    email: 'daniel@okaforconsult.com',
    summary: 'High-converting landing page for a product launch.',
    status: 'New',
    createdAt: '2026-10-07T16:55:00',
    fields: [],
    inquiry: {
      need: 'Landing page',
      projectId: 'PRJ-1036',
      budget: '$1,000 - $1,800',
      timeline: '3 weeks',
      company: 'Okafor Consulting',
      contactMethod: '',
      about:
        'Need a high-converting landing page for a product launch next month.',
    },
    notes: [],
  },
  {
    id: 'inq-1035',
    categoryId: 'inquiries',
    name: 'Hana Kobayashi',
    phone: '+81 90 1234 5678',
    email: 'hana.kobayashi@studio-k.jp',
    summary: 'Design system and component library for a SaaS product.',
    status: 'Contacted',
    createdAt: '2026-10-06T10:30:00',
    fields: [],
    inquiry: {
      need: 'Design system',
      budget: '$6,000 - $9,000',
      timeline: '8 weeks',
      company: 'Studio K',
      contactMethod: 'Email',
      about:
        'We want a documented design system to speed up our in-house product team.',
    },
    notes: [],
  },
]

export const projectInquiries: Submission[] = [
  {
    id: 'prj-2048',
    categoryId: 'project_inquiries',
    name: 'Laila Haddad',
    email: 'laila.haddad@fintech.io',
    summary: 'Interested in "Aurora Mobile Banking" case study.',
    status: 'New',
    createdAt: '2026-10-15T12:10:00',
    fields: [
      { label: 'Interested project', value: 'Aurora Mobile Banking' },
      { label: 'Project type', value: 'Mobile app' },
      { label: 'Budget range', value: '$15,000+' },
      { label: 'Preferred contact', value: 'Email' },
      {
        label: 'Message',
        value:
          'Saw the Aurora case study on your portfolio — we are building something similar for a fintech launch.',
      },
    ],
    notes: [],
  },
  {
    id: 'prj-2047',
    categoryId: 'project_inquiries',
    name: 'Marcus Bennett',
    phone: '+44 7700 900123',
    email: 'marcus@bennettstudio.co.uk',
    summary: 'Interested in "Verdant Brand Refresh" project.',
    status: 'New',
    createdAt: '2026-10-14T09:05:00',
    fields: [
      { label: 'Interested project', value: 'Verdant Brand Refresh' },
      { label: 'Project type', value: 'Branding' },
      { label: 'Budget range', value: '$5,000 - $8,000' },
      { label: 'Preferred contact', value: 'Phone' },
      {
        label: 'Message',
        value: 'Loved the palette work on Verdant. Can we do something in that direction?',
      },
    ],
    notes: [],
  },
  {
    id: 'prj-2046',
    categoryId: 'project_inquiries',
    name: 'Chen Wei',
    phone: '+86 138 0013 8000',
    email: 'chen.wei@northwind.cn',
    summary: 'Interested in "Northwind Dashboard" project.',
    status: 'Contacted',
    createdAt: '2026-10-13T16:40:00',
    fields: [
      { label: 'Interested project', value: 'Northwind Dashboard' },
      { label: 'Project type', value: 'Web app' },
      { label: 'Budget range', value: '$10,000 - $15,000' },
      { label: 'Preferred contact', value: 'Phone' },
      {
        label: 'Message',
        value: 'We need an analytics dashboard with a similar information density.',
      },
    ],
    notes: [],
  },
  {
    id: 'prj-2045',
    categoryId: 'project_inquiries',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@atlasretail.ma',
    summary: 'Interested in "Atlas E-commerce" project.',
    status: 'In Discussion',
    createdAt: '2026-10-12T11:20:00',
    fields: [
      { label: 'Interested project', value: 'Atlas E-commerce' },
      { label: 'Project type', value: 'E-commerce' },
      { label: 'Budget range', value: '$8,000 - $12,000' },
      { label: 'Preferred contact', value: 'Email' },
      {
        label: 'Message',
        value: 'Looking to launch a multi-currency store before Ramadan.',
      },
    ],
    notes: [
      {
        id: 'n-6',
        text: 'Shared Atlas case study and timeline options.',
        createdAt: '2026-10-12T13:00:00',
      },
    ],
  },
  {
    id: 'prj-2044',
    categoryId: 'project_inquiries',
    name: 'Tom Fischer',
    phone: '+49 151 23456789',
    email: 'tom.fischer@helios.de',
    summary: 'Interested in "Helios Landing Page" project.',
    status: 'Proposal Sent',
    createdAt: '2026-10-11T14:15:00',
    fields: [
      { label: 'Interested project', value: 'Helios Landing Page' },
      { label: 'Project type', value: 'Landing page' },
      { label: 'Budget range', value: '$2,000 - $4,000' },
      { label: 'Preferred contact', value: 'Phone' },
      {
        label: 'Message',
        value: 'Need a launch page fast. Helios is exactly the style we want.',
      },
    ],
    notes: [],
  },
  {
    id: 'prj-2043',
    categoryId: 'project_inquiries',
    name: 'Isabella Romano',
    phone: '+39 333 555 6677',
    email: 'isabella@lumen.design',
    summary: 'Interested in "Lumen Design System" project.',
    status: 'Won',
    createdAt: '2026-10-09T08:30:00',
    fields: [
      { label: 'Interested project', value: 'Lumen Design System' },
      { label: 'Project type', value: 'Design system' },
      { label: 'Budget range', value: '$9,000 - $12,000' },
      { label: 'Preferred contact', value: 'Phone' },
      {
        label: 'Message',
        value: 'We want the same rigor Lumen has across our product lines.',
      },
    ],
    notes: [
      {
        id: 'n-7',
        text: 'Kickoff scheduled. Scope locked to phase one.',
        createdAt: '2026-10-10T09:00:00',
      },
    ],
  },
  {
    id: 'prj-2042',
    categoryId: 'project_inquiries',
    name: 'Kwame Mensah',
    phone: '+233 24 555 7788',
    email: 'kwame@saharalogistics.gh',
    summary: 'Interested in "Sahara Logistics Portal" project.',
    status: 'Lost',
    createdAt: '2026-10-08T15:50:00',
    fields: [
      { label: 'Interested project', value: 'Sahara Logistics Portal' },
      { label: 'Project type', value: 'Web app' },
      { label: 'Budget range', value: '$10,000+' },
      { label: 'Preferred contact', value: 'Phone' },
      {
        label: 'Message',
        value: 'Comparing a few teams for a client portal build.',
      },
    ],
    notes: [],
  },
  {
    id: 'prj-2041',
    categoryId: 'project_inquiries',
    name: 'Olga Petrova',
    email: 'olga.petrova@nova-saas.com',
    summary: 'Interested in "Nova SaaS Website" project.',
    status: 'New',
    createdAt: '2026-10-07T19:25:00',
    fields: [
      { label: 'Interested project', value: 'Nova SaaS Website' },
      { label: 'Project type', value: 'Marketing website' },
      { label: 'Budget range', value: '$4,000 - $7,000' },
      { label: 'Preferred contact', value: 'Email' },
      {
        label: 'Message',
        value: 'We are pre-launch and need a polished site within six weeks.',
      },
    ],
    notes: [],
  },
]

export const callBookings: Submission[] = [
  {
    id: 'cal-3054',
    categoryId: 'call_bookings',
    name: 'Sara Lindqvist',
    phone: '+46 70 123 45 67',
    email: 'sara.lindqvist@nordicapps.se',
    summary: 'Free call about a native app build for Q1.',
    status: 'New',
    createdAt: '2026-10-15T14:30:00',
    fields: [
      { label: 'Preferred date', value: 'Oct 20, 2026' },
      { label: 'Preferred time', value: '10:00 - 10:30' },
      { label: 'Timezone', value: 'CET (UTC+1)' },
      { label: 'Topic', value: 'Native app build and timeline' },
    ],
    notes: [],
  },
  {
    id: 'cal-3053',
    categoryId: 'call_bookings',
    name: 'Omar Farouk',
    phone: '+20 100 555 1234',
    email: 'omar.farouk@cairotech.eg',
    summary: 'Free call about migrating to a new web stack.',
    status: 'New',
    createdAt: '2026-10-15T09:10:00',
    fields: [
      { label: 'Preferred date', value: 'Oct 21, 2026' },
      { label: 'Preferred time', value: '16:00 - 16:30' },
      { label: 'Timezone', value: 'EET (UTC+2)' },
      { label: 'Topic', value: 'Platform migration and performance' },
    ],
    notes: [],
  },
  {
    id: 'cal-3052',
    categoryId: 'call_bookings',
    name: 'Grace Kim',
    phone: '+82 10 5555 6666',
    email: 'grace.kim@seoulworks.kr',
    summary: 'Free call to scope a design sprint.',
    status: 'Contacted',
    createdAt: '2026-10-14T11:45:00',
    fields: [
      { label: 'Preferred date', value: 'Oct 19, 2026' },
      { label: 'Preferred time', value: '09:30 - 10:00' },
      { label: 'Timezone', value: 'KST (UTC+9)' },
      { label: 'Topic', value: 'Design sprint for a new product line' },
    ],
    notes: [],
  },
  {
    id: 'cal-3051',
    categoryId: 'call_bookings',
    name: 'Lucas Moreau',
    phone: '+33 6 12 34 56 78',
    email: 'lucas.moreau@parisbrew.fr',
    summary: 'Free call about an e-commerce replatform.',
    status: 'In Discussion',
    createdAt: '2026-10-13T17:05:00',
    fields: [
      { label: 'Preferred date', value: 'Oct 22, 2026' },
      { label: 'Preferred time', value: '14:00 - 14:45' },
      { label: 'Timezone', value: 'CET (UTC+1)' },
      { label: 'Topic', value: 'E-commerce replatform and SEO' },
    ],
    notes: [
      {
        id: 'n-8',
        text: 'Send a short case study list before the call.',
        createdAt: '2026-10-13T18:00:00',
      },
    ],
  },
  {
    id: 'cal-3050',
    categoryId: 'call_bookings',
    name: 'Aisha Bello',
    phone: '+234 803 555 9911',
    email: 'aisha.bello@lagostech.ng',
    summary: 'Free call about a logistics dashboard.',
    status: 'Won',
    createdAt: '2026-10-11T08:20:00',
    fields: [
      { label: 'Preferred date', value: 'Oct 16, 2026' },
      { label: 'Preferred time', value: '11:00 - 11:30' },
      { label: 'Timezone', value: 'WAT (UTC+1)' },
      { label: 'Topic', value: 'Logistics dashboard discovery' },
    ],
    notes: [
      {
        id: 'n-9',
        text: 'Converted after the call. Proposal requested.',
        createdAt: '2026-10-11T12:00:00',
      },
    ],
  },
  {
    id: 'cal-3049',
    categoryId: 'call_bookings',
    name: 'Nikhil Verma',
    phone: '+91 99220 33445',
    email: 'nikhil.verma@induspay.in',
    summary: 'Free call about a payments integration.',
    status: 'Proposal Sent',
    createdAt: '2026-10-10T13:15:00',
    fields: [
      { label: 'Preferred date', value: 'Oct 18, 2026' },
      { label: 'Preferred time', value: '15:30 - 16:00' },
      { label: 'Timezone', value: 'IST (UTC+5:30)' },
      { label: 'Topic', value: 'Payments integration and compliance' },
    ],
    notes: [],
  },
  {
    id: 'cal-3048',
    categoryId: 'call_bookings',
    name: 'Elena Novak',
    phone: '+420 601 234 567',
    email: 'elena.novak@praha.io',
    summary: 'Free call about a booking platform.',
    status: 'Lost',
    createdAt: '2026-10-09T16:40:00',
    fields: [
      { label: 'Preferred date', value: 'Oct 17, 2026' },
      { label: 'Preferred time', value: '12:00 - 12:30' },
      { label: 'Timezone', value: 'CET (UTC+1)' },
      { label: 'Topic', value: 'Booking platform for a hospitality group' },
    ],
    notes: [],
  },
  {
    id: 'cal-3047',
    categoryId: 'call_bookings',
    name: 'Jack Thompson',
    email: 'jack.thompson@sydneydata.au',
    summary: 'Free call about a data visualization project.',
    status: 'New',
    createdAt: '2026-10-08T07:55:00',
    fields: [
      { label: 'Preferred date', value: 'Oct 23, 2026' },
      { label: 'Preferred time', value: '08:00 - 08:30' },
      { label: 'Timezone', value: 'AEST (UTC+10)' },
      { label: 'Topic', value: 'Data visualization for a public dashboard' },
    ],
    notes: [],
  },
]

export const submissionsByCategory: Record<SubmissionCategoryId, Submission[]> =
  {
    inquiries,
    project_inquiries: projectInquiries,
    call_bookings: callBookings,
  }

export const allSubmissions: Submission[] = [
  ...inquiries,
  ...projectInquiries,
  ...callBookings,
]

export function getCategory(
  categoryId: SubmissionCategoryId,
): SubmissionCategory | undefined {
  return submissionCategories.find((category) => category.id === categoryId)
}

export function getCategorySubmissions(
  categoryId: SubmissionCategoryId,
): Submission[] {
  return submissionsByCategory[categoryId]
}

export function getSubmission(
  categoryId: SubmissionCategoryId | undefined,
  submissionId: string | undefined,
): Submission | undefined {
  if (!categoryId || !submissionId) return undefined
  return submissionsByCategory[categoryId].find(
    (submission) => submission.id === submissionId,
  )
}
