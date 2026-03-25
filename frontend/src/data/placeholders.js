export const mentorsData = [
  {
    id: 'm1',
    initials: 'SR',
    avatarColorClass: 'av-p',
    name: 'Sanya Rowe',
    role: 'Senior PM · Google · 8 yrs exp',
    availabilityStatus: 'available',
    nextAvailable: 'Available this week',
    tags: [
      { label: 'Product Strategy', class: 'tag-p' },
      { label: '0-to-1', class: 'tag-p' },
      { label: 'Consumer Apps', class: 'tag-t' },
      { label: 'OKRs', class: '' },
    ],
    rating: '4.9',
    sessions: 34,
    hourlyRate: 120,
    quote: '"I help PMs move from execution to strategy — understanding the why before the what."',
  },
  {
    id: 'm2',
    initials: 'MK',
    avatarColorClass: 'av-t',
    name: 'Marcus Kwon',
    role: 'Group PM · Stripe · 11 yrs exp',
    availabilityStatus: 'available',
    nextAvailable: 'Available this week',
    tags: [
      { label: 'FinTech', class: 'tag-p' },
      { label: 'B2B SaaS', class: 'tag-p' },
      { label: 'Pricing', class: 'tag-t' },
      { label: 'API Products', class: '' },
    ],
    rating: '4.8',
    sessions: 61,
    hourlyRate: 150,
    quote: '"Specialise in payments and developer products. Ask me anything about monetisation."',
  },
  {
    id: 'm3',
    initials: 'PV',
    avatarColorClass: 'av-a',
    name: 'Priya Varma',
    role: 'PM Lead · Meta · 6 yrs exp',
    availabilityStatus: 'busy',
    nextAvailable: 'Next available: Mon',
    tags: [
      { label: 'Growth', class: 'tag-p' },
      { label: 'Social', class: 'tag-t' },
      { label: 'Experimentation', class: '' },
      { label: 'A/B Testing', class: '' },
    ],
    rating: '4.7',
    sessions: 28,
    hourlyRate: 110,
    quote: '"Growth-stage PM with a data-first mindset. Love working on north star metrics."',
  },
  {
    id: 'm4',
    initials: 'DL',
    avatarColorClass: 'av-b',
    name: 'Devon Lim',
    role: 'Director of PM · Notion · 10 yrs exp',
    availabilityStatus: 'available',
    nextAvailable: 'Available this week',
    tags: [
      { label: 'Productivity', class: 'tag-p' },
      { label: 'Enterprise', class: 'tag-p' },
      { label: 'PLG', class: 'tag-t' },
      { label: 'Roadmapping', class: '' },
    ],
    rating: '5.0',
    sessions: 12,
    hourlyRate: 180,
    quote: '"Helping PMs bridge the gap between user delight and business outcomes."',
  },
  {
    id: 'm5',
    initials: 'TN',
    avatarColorClass: 'av-g',
    name: 'Tariq Naseer',
    role: 'Staff PM · Shopify · 9 yrs exp',
    availabilityStatus: 'busy',
    nextAvailable: 'Next available: Wed',
    tags: [
      { label: 'Commerce', class: 'tag-p' },
      { label: 'Platform', class: 'tag-t' },
      { label: 'Marketplace', class: '' },
      { label: 'Ecosystems', class: '' },
    ],
    rating: '4.9',
    sessions: 47,
    hourlyRate: 130,
    quote: '"Platform and marketplace specialist — I focus on multi-sided product thinking."',
  },
  {
    id: 'm6',
    initials: 'AJ',
    avatarColorClass: 'av-p',
    name: 'Amara Joshi',
    role: 'Principal PM · Microsoft · 13 yrs exp',
    availabilityStatus: 'available',
    nextAvailable: 'Available this week',
    tags: [
      { label: 'AI/ML Products', class: 'tag-p' },
      { label: 'Enterprise', class: 'tag-t' },
      { label: 'Azure', class: '' },
      { label: 'Career Growth', class: '' },
    ],
    rating: '4.8',
    sessions: 89,
    hourlyRate: 160,
    quote: '"Specialise in AI product strategy and helping senior ICs move into PM roles."',
  },
];

export const eventsData = [
  {
    id: 'e1',
    dateText: 'Tue 1 Apr · 6:00 PM IST',
    badges: [
      { label: '● Live', class: 'badge-live' },
      { label: 'Virtual', class: 'badge-virtual' },
      { label: 'Free', class: 'badge-free' },
    ],
    title: 'PM Interview Masterclass: cracking the case round',
    meta: 'Hosted by Sanya Rowe · 60 min · Zoom',
    description: 'Walk through 3 live case studies with real-time Q&A. 42 registered.',
    isPast: false,
    cta: 'Register ↗',
  },
  {
    id: 'e2',
    dateText: 'Thu 3 Apr · 7:30 PM IST',
    badges: [
      { label: '● Live', class: 'badge-live' },
      { label: 'Virtual', class: 'badge-virtual' },
      { label: '₹499', class: 'badge-paid' },
    ],
    title: 'From engineer to PM: navigating the career switch',
    meta: 'Hosted by Amara Joshi · 90 min · Google Meet',
    description: 'Panel + AMA with 3 PMs who made the tech-to-PM transition. 18 seats left.',
    isPast: false,
    cta: 'Register ↗',
  },
  {
    id: 'e3',
    dateText: 'Sat 5 Apr · 10:00 AM IST',
    badges: [
      { label: 'In person', class: 'badge-inperson' },
      { label: 'Free', class: 'badge-free' },
    ],
    title: 'PM community meetup — Bengaluru #12',
    meta: '91springboard, Koramangala · 3 hrs · 60 spots',
    description: 'Monthly in-person networking for Bengaluru PMs. Lightning talks + open networking.',
    isPast: false,
    cta: 'Register ↗',
  },
  {
    id: 'e4',
    dateText: 'Wed 9 Apr · 8:00 PM IST',
    badges: [
      { label: 'Virtual', class: 'badge-virtual' },
      { label: 'Free', class: 'badge-free' },
    ],
    title: 'Office hours: ask a hiring manager anything',
    meta: 'Hosted by Devon Lim · 60 min · Zoom',
    description: 'Open Q&A — bring your resume, portfolio, or career questions. First-come seats.',
    isPast: false,
    cta: 'Register ↗',
  },
  {
    id: 'e5',
    dateText: 'Fri 11 Apr · 5:00 PM IST',
    badges: [
      { label: 'Virtual', class: 'badge-virtual' },
      { label: '₹299', class: 'badge-paid' },
    ],
    title: 'Metrics that matter: data storytelling for PMs',
    meta: 'Hosted by Priya Varma · 75 min · Google Meet',
    description: 'Learn to build and present metrics dashboards that influence roadmap decisions.',
    isPast: false,
    cta: 'Register ↗',
  },
  {
    id: 'e6',
    dateText: 'Sat 19 Apr · 11:00 AM IST',
    badges: [
      { label: '● Live', class: 'badge-live' },
      { label: 'Virtual', class: 'badge-virtual' },
      { label: 'Free', class: 'badge-free' },
    ],
    title: 'Mock interview day — product design round',
    meta: 'Multiple mentors · 3 hrs · Zoom breakout rooms',
    description: 'Paired mock interviews with real mentor feedback. Limited to 30 participants.',
    isPast: false,
    cta: 'Register ↗',
  },
  {
    id: 'e7',
    dateText: 'Sat 15 Mar · PAST',
    badges: [
      { label: 'Ended', inlineStyle: { background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' } },
    ],
    title: 'Breaking into FAANG as a PM',
    meta: 'Hosted by Marcus Kwon · 120 min · 94 attended',
    description: 'Recording available for registered learners.',
    isPast: true,
    cta: 'Watch recording',
  },
  {
    id: 'e8',
    dateText: 'Tue 4 Mar · PAST',
    badges: [
      { label: 'Ended', inlineStyle: { background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' } },
    ],
    title: 'Writing your PM story: resume and portfolio workshop',
    meta: 'Hosted by Sanya Rowe · 60 min · 57 attended',
    description: 'Recording available for registered learners.',
    isPast: true,
    cta: 'Watch recording',
  },
];

export const blogData = [
  {
    id: 'st1',
    emoji: '📈',
    catClass: 'blog-cat-career',
    category: 'Career',
    title: "The PM Interview : A PM's Perspective",
    preview: "Preparing for an entry-level product management role: what to prioritize and what skills are essential...",
    authorInitials: 'ST',
    authorAvatarClass: 'av-t',
    authorName: 'Shravan Tikoo',
    readTime: '6 min read',
    content: `The PM Interview : A PM's Perspective

Preparing for a Product Management interview requires a structural shift in how you approach problem-solving. It's not just about frameworks like CIRCLES; it's about demonstrating product sense, empathy for the user, and an understanding of business alignment.

Key Areas to Master:
1. Product Sense: Can you identify the core user problem? Do you immediately jump to solutions, or do you spend time empathizing with the pain point?
2. Execution: How do you prioritize features? Familiarize yourself with methodologies that map trade-offs.
3. Behavioral: Every story should highlight a situation where you exhibited judgment under ambiguity.

Remember: Interviewers are calibrating your thought process, not just the final feature you suggest. The best candidates communicate assumptions explicitly and validate them dynamically.`
  },
  {
    id: 'st2',
    emoji: '❤️',
    catClass: 'blog-cat-product',
    category: 'Product thinking',
    title: "How to build products users 'LOVE' : A PM's Perspective",
    preview: "Ideas for building products that users are passionate about, emphasizing the human experience...",
    authorInitials: 'ST',
    authorAvatarClass: 'av-p',
    authorName: 'Shravan Tikoo',
    readTime: '8 min read',
    content: `How to build products users 'LOVE' : A PM's Perspective

The distinction between a product users "use" and a product users "love" comes down to the human experience. Retention is a lagging indicator of love. 

Core Principles to Drive Love:
- Frictionless Onboarding: Time-to-value must be measured in seconds, not interactions. 
- The Aha! Moment: Engineer the product flow precisely so the user experiences the sheer value of your offering as early as possible.
- Micro-interactions: Those tiny moments of delight—like a satisfying checkmark animation—compound to build emotional connection.
- Community and Belonging: Products that facilitate human-to-human interaction naturally command higher emotional loyalty.

Stop building features based solely on Jira tickets; start building features based on emotional payoffs.`
  },
  {
    id: 'st3',
    emoji: '🧩',
    catClass: 'blog-cat-skill',
    category: 'Skill building',
    title: "First Principle Thinking : A PM's Perspective",
    preview: "Fundamental ideas that have shaped great consumer experiences and how PMs can apply them...",
    authorInitials: 'ST',
    authorAvatarClass: 'av-g',
    authorName: 'Shravan Tikoo',
    readTime: '5 min read',
    content: `First Principle Thinking : A PM's Perspective

Elon Musk popularized it, but what does First Principle Thinking actually mean for a Product Manager? It means stripping away "how it's always been done" and breaking a problem down to its fundamental, undeniable truths.

Steps to apply it:
1. Identify and define your current assumptions. Example: "Our users need a mobile app to book flights."
2. Breakdown the problem into fundamental principles. Example: "Users need a way to secure a seat on a plane from anywhere."
3. Create new solutions from scratch. Example: "Could they book via WhatsApp or SMS instead of downloading an app?"

When you stop trying to build a slightly better version of your competitor, and start building directly from the atomic constraints of the user's need, you achieve step-function innovation.`
  },
  {
    id: 'b1',
    emoji: '📐',
    catClass: 'blog-cat-product',
    category: 'Product thinking',
    title: "The CIRCLES framework isn't enough — here's what to add",
    preview: "Most PMs learn CIRCLES and stop. Senior interviewers are looking for something beyond the template...",
    authorInitials: 'SR',
    authorAvatarClass: 'av-p',
    authorName: 'Sanya Rowe',
    readTime: '5 min read',
  },
  {
    id: 'b2',
    emoji: '📊',
    catClass: 'blog-cat-skill',
    category: 'Data & metrics',
    title: 'How to answer "how would you measure success?" without freezing',
    preview: "It's the most common analytical interview question — and the most mishandled. A structured approach that works across all product types...",
    authorInitials: 'PV',
    authorAvatarClass: 'av-t',
    authorName: 'Priya Varma',
    readTime: '7 min read',
  },
  {
    id: 'b3',
    emoji: '🎯',
    catClass: 'blog-cat-career',
    category: 'Career',
    title: 'Why your PM resume is getting screened out in 8 seconds',
    preview: 'Hiring managers spend less time on a resume than you think. Three structural changes that change how they read yours...',
    authorInitials: 'DL',
    authorAvatarClass: 'av-b',
    authorName: 'Devon Lim',
    readTime: '4 min read',
  },
  {
    id: 'b4',
    emoji: '🤝',
    catClass: 'blog-cat-interview',
    category: 'Interview prep',
    title: "The behavioural interview isn't about stories — it's about judgment",
    preview: 'STAR method is necessary but not sufficient. What actually differentiates a great behavioural answer is the insight you surface at the end...',
    authorInitials: 'TN',
    authorAvatarClass: 'av-g',
    authorName: 'Tariq Naseer',
    readTime: '6 min read',
  },
  {
    id: 'b5',
    emoji: '⚡',
    catClass: 'blog-cat-career',
    category: 'Career',
    title: 'APM vs senior PM vs director: what each interview actually tests',
    preview: 'The same question lands differently at each level. Here\'s what interviewers are calibrating for when they ask "tell me about a product you built"...',
    authorInitials: 'AJ',
    authorAvatarClass: 'av-p',
    authorName: 'Amara Joshi',
    readTime: '8 min read',
  },
  {
    id: 'b6',
    emoji: '🔍',
    catClass: 'blog-cat-product',
    category: 'Product thinking',
    title: 'Prioritisation frameworks compared: RICE, ICE, Kano — when to use which',
    preview: "Knowing the acronyms isn't enough. The framework you choose signals how you think about trade-offs — and interviewers notice...",
    authorInitials: 'MK',
    authorAvatarClass: 'av-t',
    authorName: 'Marcus Kwon',
    readTime: '6 min read',
  },
  {
    id: 'b7',
    emoji: '🧠',
    catClass: 'blog-cat-interview',
    category: 'Interview prep',
    title: "What I look for in strategy interviews — a hiring manager's view",
    preview: "After 200+ PM interviews, patterns emerge. Most candidates get the framework right and the insight wrong. Here's how to flip that...",
    authorInitials: 'DL',
    authorAvatarClass: 'av-b',
    authorName: 'Devon Lim',
    readTime: '9 min read',
  },
  {
    id: 'b8',
    emoji: '🚀',
    catClass: 'blog-cat-skill',
    category: 'Skill building',
    title: 'Technical depth for non-engineering PMs: exactly what to learn',
    preview: "You don't need to code. But you do need to speak to engineers without hand-waving. A focused 4-week plan to build technical credibility...",
    authorInitials: 'AJ',
    authorAvatarClass: 'av-p',
    authorName: 'Amara Joshi',
    readTime: '7 min read',
  },
];
