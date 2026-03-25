export const MOCK_GAP_ANALYSIS = {
  archetypes: [
    {
      name: 'Growth PM',
      icon: 'trending-up',
      score: 82,
      tagline: 'You thrive at the intersection of data and user growth.',
      reason:
        'You scored highest on experimentation mindset, funnel analysis, and metric-driven decision making. Your responses on A/B testing scenarios and retention strategy showed strong instincts for growth loops and data-informed iteration.',
    },
    {
      name: 'AI PM',
      icon: 'cpu',
      score: 68,
      tagline: 'You bridge the gap between AI capabilities and user needs.',
      reason:
        'You demonstrated solid understanding of ML model evaluation and prompt engineering concepts, but scored lower on data pipeline architecture and model deployment trade-offs. Your product intuition around AI use cases is strong.',
    },
    {
      name: 'Tech PM',
      icon: 'layers',
      score: 55,
      tagline: 'You speak the language of engineering and architecture.',
      reason:
        'Your technical depth in system design and API thinking was moderate. You showed good instincts for platform trade-offs but had gaps in infrastructure scaling scenarios and technical debt prioritization.',
    },
    {
      name: 'General PM',
      icon: 'compass',
      score: 74,
      tagline: 'You are a versatile PM who can adapt across domains.',
      reason:
        'You showed well-rounded capabilities across stakeholder management, roadmap planning, and cross-functional communication. Your strongest signals were in prioritization frameworks and user story articulation.',
    },
  ],
  readiness: {
    overall: 72,
    sub_scores: {
      strategic_thinking: 85,
      technical_proficiency: 60,
      execution_delivery: 70,
    },
  },
  gap_profile: [
    { skill: 'Data Analysis', current: 6, required: 9 },
    { skill: 'Stakeholder Management', current: 8, required: 8 },
    { skill: 'Technical Architecture', current: 4, required: 7 },
    { skill: 'User Research', current: 7, required: 8 },
    { skill: 'Roadmap Strategy', current: 5, required: 9 },
    { skill: 'Experimentation', current: 3, required: 8 },
  ],
  resume_skills: {
    extracted: ['SQL', 'A/B Testing', 'Roadmapping', 'Jira', 'Amplitude', 'PRDs'],
    source: 'resume',
    match_percentage: 64,
  },
  fitment_scores: [
    {
      dimension: 'Strategic Thinking',
      score: 85,
      max_score: 100,
      basis:
        'Assessed via scenario-based questions on prioritization frameworks, market analysis, and long-term vision articulation.',
      questions_evaluated: 5,
    },
    {
      dimension: 'Technical Proficiency',
      score: 60,
      max_score: 100,
      basis:
        'Evaluated understanding of APIs, system design trade-offs, and data pipeline concepts relevant to PM decision-making.',
      questions_evaluated: 4,
    },
    {
      dimension: 'Execution & Delivery',
      score: 70,
      max_score: 100,
      basis:
        'Measured through sprint planning scenarios, stakeholder communication cases, and delivery risk assessment.',
      questions_evaluated: 5,
    },
  ],
};
