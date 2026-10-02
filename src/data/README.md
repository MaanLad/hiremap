# Hiring map data

The data layer is organized for contributors who want to add hiring experience without editing the canvas.

## Structure

- `nodes/` contains reusable concepts grouped by concern: company types, hiring goals, requirements, preparation, channels, processes, and endpoints.
- `routes/` contains relationships for an organization or hiring route.
- `schema.ts` defines supported levels and company types. Use `NODE_LEVEL` and
  `COMPANY_TYPE` constants instead of manually typing their string values.
- `types.ts` defines the shared `HiringNode`, `HiringEdge`, and `HiringMap` shapes.
- `registry.ts` is the single aggregation and validation boundary.
- `graphModel.ts` contains shared level labels and graph indexes used by the canvas.
- `index.js` is the public data entry point.

The registry exports the normalized shape consumed by the app:

```js
{
  nodes: [],
  edges: [],
}
```

## Add a node

Add a globally unique kebab-case ID to the concern module that best describes it:

```js
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
}
```

Import the constants at the top of the node module:

```js
import { COMPANY_TYPE, NODE_LEVEL } from '../schema';
```

Run `pnpm typecheck` to check node fields and allowed values before submitting.

The `@type` comment above each node array connects JavaScript data to the
TypeScript `HiringNode` interface. It makes the editor check every item in the
array, including required fields, field types, and allowed `level` and
`companyType` values. The equivalent annotation for route arrays uses
`HiringEdge`.

Supported levels are `companyType`, `hiringGoal`, `requirements`, `preparation`, `hiringChannel`, `hiringProcess`, and `endpoint`.

## Connect a node

Add the relationship to the route module that owns the hiring path:

```js
{
  id: 'community-to-process',
  source: 'community-mentorship',
  target: 'technical-process',
}
```

Both endpoints must exist in a node module. Edge IDs must also be globally unique.

## Validation

The registry validates every import and throws on duplicate IDs, unsupported levels or company types, missing labels, duplicate edge IDs, and missing edge endpoints. Run `pnpm build` to validate the complete graph before submitting a contribution.

Keep content and relationships in the data layer. Do not add React Flow positions, animation flags, selection state, or layout-specific fields to contributor data.
