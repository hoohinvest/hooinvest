/**
 * Team Members Data
 * 
 * Edit this file to add, remove, or update team member information.
 * Each member should have a unique id and required fields (name, role, bioShort).
 * 
 * To add a team member:
 * 1. Add a new object to the teamMembers array
 * 2. Use a unique id (e.g., "ceo", "cto", "compliance-lead")
 * 3. Add headshot image to /public/team/{id}.jpg (optional)
 * 4. Include focus tags relevant to their role
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  headshotUrl?: string;
  bioShort: string;
  location?: string;
  linkedin?: string;
  emailPublic?: string;
  focus: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'ceo',
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    headshotUrl: '/team/ceo.jpg',
    bioShort: 'Former VP at a leading fintech platform, Sarah brings 12+ years in PropTech and alternative investments. Built and scaled marketplaces connecting capital to real assets.',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/sarahchen',
    focus: ['Vision', 'Strategy', 'Marketplace', 'Capital Markets']
  },
  {
    id: 'cto',
    name: 'Michael Torres',
    role: 'CTO & Co-Founder',
    headshotUrl: '/team/cto.jpg',
    bioShort: 'Security-first engineer with experience at major payment processors. Led platform architecture for high-compliance environments handling sensitive financial data.',
    location: 'Austin, TX',
    linkedin: 'https://linkedin.com/in/michaeltorres',
    focus: ['Security', 'Infrastructure', 'Integrations', 'Scalability']
  },
  {
    id: 'compliance',
    name: 'David Kim',
    role: 'Head of Compliance',
    headshotUrl: '/team/compliance.jpg',
    bioShort: 'Former securities attorney and compliance officer at a top crowdfunding platform. Expert in Reg CF, Reg D, Reg A+ offerings, AML/KYC, and broker-dealer regulations.',
    location: 'New York, NY',
    linkedin: 'https://linkedin.com/in/davidkim',
    focus: ['Regulatory', 'AML/KYC', 'Securities Law', 'Risk Management']
  },
  {
    id: 'product',
    name: 'Jessica Martinez',
    role: 'Head of Product',
    headshotUrl: '/team/product.jpg',
    bioShort: 'Product leader with a background in consumer fintech and investment platforms. Passionate about making complex financial products accessible and delightful.',
    location: 'Seattle, WA',
    linkedin: 'https://linkedin.com/in/jessicamartinez',
    focus: ['UX Design', 'Marketplace Design', 'User Research', 'Product Strategy']
  },
  {
    id: 'growth',
    name: 'Alex Patel',
    role: 'Head of Growth',
    headshotUrl: '/team/growth.jpg',
    bioShort: 'Growth and partnerships veteran from SaaS and marketplace startups. Built acquisition funnels for both supply (issuers) and demand (investors) sides of two-sided platforms.',
    location: 'Los Angeles, CA',
    linkedin: 'https://linkedin.com/in/alexpatel',
    focus: ['Acquisition', 'Partnerships', 'Analytics', 'Investor Relations']
  },
  {
    id: 'operations',
    name: 'Emily Watson',
    role: 'VP of Operations & Finance',
    headshotUrl: '/team/operations.jpg',
    bioShort: 'Former operations manager at a licensed escrow company. Deep expertise in fund administration, reconciliation, payouts, and operational compliance for financial services.',
    location: 'Chicago, IL',
    linkedin: 'https://linkedin.com/in/emilywatson',
    focus: ['Escrow', 'Fund Administration', 'Reconciliation', 'Payouts']
  },
  {
    id: 'engineering',
    name: 'James Li',
    role: 'Senior Engineering Lead',
    headshotUrl: '/team/engineering.jpg',
    bioShort: 'Full-stack engineer with 10 years building production systems for fintech. Specializes in real-time data pipelines, API design, and developer experience.',
    location: 'Remote',
    linkedin: 'https://linkedin.com/in/jamesli',
    focus: ['Full-Stack', 'APIs', 'Data Engineering', 'DevOps']
  },
  {
    id: 'community',
    name: 'Rachel Green',
    role: 'Community & Support Lead',
    headshotUrl: '/team/community.jpg',
    bioShort: 'Community builder and customer success expert. Ensures investors and businesses have white-glove support throughout the onboarding and investment lifecycle.',
    location: 'Denver, CO',
    linkedin: 'https://linkedin.com/in/rachelgreen',
    emailPublic: 'rachel@hooinvest.com',
    focus: ['Support', 'Community', 'Onboarding', 'Customer Success']
  }
];

/**
 * How to add a new team member:
 * 
 * 1. Copy this template:
 * 
 * {
 *   id: 'unique-id-here',
 *   name: 'Full Name',
 *   role: 'Job Title',
 *   headshotUrl: '/team/unique-id-here.jpg',  // optional
 *   bioShort: 'One to two sentence bio highlighting credibility and expertise.',
 *   location: 'City, State',  // optional
 *   linkedin: 'https://linkedin.com/in/profile',  // optional
 *   emailPublic: 'email@hooinvest.com',  // optional
 *   focus: ['Tag1', 'Tag2', 'Tag3']
 * }
 * 
 * 2. Add it to the teamMembers array above
 * 3. Add headshot image to /public/team/{id}.jpg (512x512px recommended)
 * 4. Save and the About page will automatically display the new member
 */


