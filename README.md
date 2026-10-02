# HireMap

An open-source interactive map that helps newcomers understand paths into
technology and computer-science careers, while giving experienced
professionals a place to share and improve the hiring routes they know.

HireMap turns hiring knowledge into an explorable map:

```text
Company type
    ↓
Hiring goal
    ↓
Requirements
    ↓
Preparation / eligibility
    ↓
Hiring channel
    ↓
Hiring process
    ↓
Hired
```

The goal is not to describe one company's exact process or promise a fixed
career recipe. HireMap provides a generalized starting point that helps
people understand their options, compare routes, and discover what to learn
next.

## Why this project exists

Career and hiring information is often scattered across job descriptions,
forums, personal experience, and official notifications. It can be difficult
to see how those pieces connect.

HireMap presents that information as a guided graph. The visual structure
stays intentionally broad, while individual nodes can contain useful detail,
examples, and context.

The project is designed so that:

- the interface can be improved independently from the hiring knowledge;
- new hiring paths can usually be added as data, without changing React code;
- contributors can document different regions, organization types, roles, and
  entry routes;
- the map can grow without becoming a list of every small hiring activity.

## Try it locally

### Requirements

- Node.js 20 or newer
- pnpm

### Install and start the app

```bash
pnpm install
pnpm dev
```

Vite will print the local development URL. Open that URL in a browser to
explore the map.

The map includes a **Community** button in the top-right controls. It links
to the GitHub repository and loads the current contributor, star, and fork
counts from GitHub when opened. Use it to find the source code, open an issue,
or share a hiring path with the project.

### Validate a change

Run the checks that apply to your contribution:

```bash
pnpm typecheck
pnpm build
pnpm lint
```

`typecheck` validates the typed data model. `build` validates the complete
application and hiring graph. `lint` checks the source code style and common
JavaScript/React problems.

## Two ways to contribute

You do not need to be a frontend developer to contribute. Choose the path
that matches what you want to improve.

### 1. Add or improve hiring data

This is the easiest way to contribute domain knowledge.

Use this path when you want to add:

- a company or organization type;
- a hiring goal or role family;
- requirements and eligibility information;
- preparation guidance;
- a hiring channel;
- a hiring process;
- an endpoint or outcome;
- relationships that connect those concepts into a useful route;
- clearer descriptions, examples, or source-backed context.

Start with the data contributor guide in
[`src/data/README.md`](./src/data/README.md).

The data layer is organized into:

```text
src/data/
├── nodes/       Concepts shown in the map
├── routes/      Relationships between concepts
├── schema.ts    Allowed levels and company types
├── types.ts     HiringNode, HiringEdge, and HiringMap types
├── registry.ts  Aggregation and validation boundary
└── graphModel.ts
```

#### Example: adding a node

```ts
import { COMPANY_TYPE, NODE_LEVEL } from '../schema';
import type { HiringNode } from '../types';

export const channels: HiringNode[] = [
  {
    id: 'community-mentorship',
    label: 'Community / Mentorship',
    subtitle: 'Build relationships and discover opportunities',
    level: NODE_LEVEL.HIRING_CHANNEL,
    companyType: COMPANY_TYPE.SHARED,
    details: {
      description: 'A community-led path into conversations and referrals.',
      examples: ['Meetups', 'Open-source communities'],
    },
  },
];
```

Important data rules:

- Use a globally unique, descriptive, kebab-case `id`.
- Use `NODE_LEVEL` and `COMPANY_TYPE` constants instead of manually typing
  level or company-type strings.
- Keep descriptions broad, useful, and honest; avoid presenting one person's
  experience as universal.
- Add a route edge when the new node should be connected to the map.
- Keep layout, animation, selection, and React Flow state out of data files.
- Run `pnpm typecheck` and `pnpm build` before opening a pull request.

### 2. Improve the application

Use this path when you want to work on the product itself:

- map navigation and exploration;
- graph layout and route behavior;
- node and detail-panel presentation;
- accessibility and responsive behavior;
- performance;
- visual design and theming;
- state management;
- tests, validation, and developer tooling;
- documentation and contributor experience.

The main application code is under [`src/`](./src/). Before changing a
component, look for an existing shared helper or pattern. When a feature can
be represented as data, prefer adding data rather than adding a special case
to the UI.

## Contribution workflow

1. Open an issue or discussion for a larger feature, a new direction, or a
   change to the map model.
2. Fork the repository and create a focused branch.
3. Make one coherent change. Data contributions and UI changes are welcome in
   separate pull requests when they are independent.
4. Add or update documentation when the contributor workflow changes.
5. Run the relevant checks:

   ```bash
   pnpm typecheck
   pnpm build
   pnpm lint
   ```

6. Open a pull request describing:
   - what changed;
   - whether it is a data or development contribution;
   - why the change is useful;
   - how it was validated;
   - any sources or regional context behind new hiring information.

Small pull requests are easier to review. If you are unsure where to start,
look for an existing issue or open one describing the information or behavior
you would like to contribute.

## Contributor recognition

HireMap values contributions beyond code. People can contribute through **hiring research**, **map/data improvements**, or **application development**.

Meaningful contributors may be recognized through project credits, contributor profiles, GitHub acknowledgements, and opportunities to take ownership of parts of the project.

See [CONTRIBUTORS.MD](./CONTRIBUTORS.MD) for the contributor levels, recognition system, and maintainer roles.


## Data quality and scope

HireMap represents generalized hiring routes, not guaranteed outcomes. When
adding information:

- distinguish common patterns from requirements that depend on a specific
  employer, country, exam, or role;
- prefer official sources for eligibility and recruitment rules;
- include regional or organizational context where it matters;
- avoid outdated, promotional, discriminatory, or unverifiable claims;
- do not add sensitive personal information;
- keep the visible graph readable by grouping fine-grained details inside
  node details rather than creating a node for every skill or activity.

## Project structure

```text
src/
├── component/   React components and map UI
├── config/      Shared application configuration
├── data/        Typed hiring-map content and graph relationships
├── provider/    Application and theme providers
└── store/       Client-side map state
```

The detailed conceptual model is available in
[`IT-CS_Hiring_Map_Generalized_Model_README.MD`](./IT-CS_Hiring_Map_Generalized_Model_README.MD).

## Technology

- React
- Vite
- TypeScript for the data layer
- React Flow
- Dagre
- Zustand
- Tailwind CSS
- Framer Motion

## License

No license has been published in this repository yet. Until a license is
added, the repository should not be treated as granting permission to reuse
or redistribute the code. If you want to help choose and add an open-source
license, please open an issue first.

## Acknowledgements

HireMap is built by people sharing practical hiring knowledge and improving
the tools that make that knowledge easier to explore. Contributions of code,
research, review, design, and lived experience are all valuable.
