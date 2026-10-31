export const profile = {
  name: 'Alex Gavalas',
  title: 'Senior Software Engineer',
  location: 'Leipzig, Germany',
  email: 'alex.gavalas.dev@gmail.com',
  introduction:
    'I build web applications and the systems behind them. Currently at Workable, turning complex problems into thoughtful, useful software.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/AlexGavalas' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alex-gavalas/' },
    { label: 'Bluesky', href: 'https://bsky.app/profile/alexgavalas.bsky.social' },
  ],
};

export const projects = [
  {
    id: 'habitthread',
    number: '01',
    name: 'HabitThread',
    category: 'A little more everyday balance',
    description:
      'Meal plans, movement, and progress, connected. A place to make sense of everyday habits and build a routine that works for you.',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
    href: 'https://habitthread.com',
    previewEmbeddable: true,
    source: 'https://github.com/AlexGavalas/habit-thread',
    linkLabel: 'Explore HabitThread',
  },
  {
    id: 'learning-path',
    number: '02',
    name: 'Learning Path',
    category: 'Following the interesting threads',
    description:
      'My growing collection of notes, resources, and things worth coming back to. Part reference shelf, part record of an ongoing curiosity.',
    technologies: ['Notes', 'Resources', 'Web development'],
    href: 'https://learning-path.dev',
    previewEmbeddable: true,
    source: 'https://github.com/AlexGavalas/learning-path',
    linkLabel: 'Wander through the notes',
  },
];

export const experience = [
  {
    company: 'Workable',
    href: 'https://www.workable.com/',
    period: '2022 — now',
    roles: [
      { title: 'Senior II Frontend Engineer', dates: 'Jan 2024 — present' },
      { title: 'Senior I Frontend Engineer', dates: 'Oct 2022 — Jan 2024' },
    ],
    description:
      'Building applicant-tracking and candidate-facing experiences. Leading frontend work on AI-powered products, evolving our microfrontend architecture, and improving the tools and shared components teams build with.',
  },
  {
    company: 'DTWISE',
    href: 'https://www.dtwise.com/',
    period: '2018 — 2022',
    roles: [{ title: 'Software Engineer', dates: 'Apr 2018 — Oct 2022' }],
    description:
      'Turning energy data into useful tools: full-stack applications, Node.js APIs, data visualizations, and a query language built on Elasticsearch. Also built for mobile and mentored junior engineers.',
  },
  {
    company: 'Agile Actors',
    href: 'https://www.agileactors.com/',
    period: '2017 — 2018',
    roles: [{ title: 'Web Developer', dates: 'Jan 2017 — Apr 2018' }],
    description:
      'Developing a data analytics platform with React and AngularJS, and improving the performance and reliability of a Node.js data-processing tool.',
  },
];
