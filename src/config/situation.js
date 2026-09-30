export const SITUATION_FIELDS = [
  {
    id: 'role',
    label: 'Role',
    selection: 'single',
    options: [
      { id: 'software-engineering', label: 'Software engineering' },
      { id: 'data-analytics', label: 'Data / analytics' },
      { id: 'cybersecurity', label: 'Cybersecurity' },
    ],
  },
  {
    id: 'level',
    label: 'Level',
    selection: 'single',
    options: [
      { id: 'student', label: 'Student' },
      { id: 'early-career', label: 'Early career' },
      { id: 'experienced', label: 'Experienced' },
    ],
  },
  {
    id: 'has',
    label: 'I have',
    selection: 'multi',
    options: [
      { id: 'projects', label: 'Projects' },
      { id: 'experience', label: 'Experience' },
      { id: 'degree', label: 'A relevant degree' },
      { id: 'certifications', label: 'Certifications' },
    ],
  },
];

export const getMockRoutes = (situation) => {
  if (!situation?.role) return [];

  return [
    {
      id: 'product-route',
      title: 'Product company route',
      summary: 'Build evidence, enter through a direct channel, and move through technical selection.',
      steps: ['Product company', 'Software engineering', 'Projects / experience', 'Careers / referral', 'Technical process'],
    },
    {
      id: 'startup-route',
      title: 'Startup route',
      summary: 'Use visible project work and conversations to reach a fast-moving technical team.',
      steps: ['Startup', 'Software engineering', 'Projects / experience', 'Recruiter / referral', 'Technical process'],
    },
  ];
};
