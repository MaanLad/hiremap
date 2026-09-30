# Hiring map data

The data layer is organized for contributors who want to add hiring experience without editing the canvas.

## Structure

- `nodes/` contains reusable concepts grouped by concern: company types, hiring goals, requirements, preparation, channels, processes, and endpoints.
- `routes/` contains relationships for an organization or hiring route.
- `schema.js` defines supported levels and company types.
- `registry.js` is the single aggregation and validation boundary.
- `graphModel.js` contains shared level labels and graph indexes used by the canvas.
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
  level: 'hiringChannel',
  companyType: 'shared',
  details: {
    description: 'A community-led path into conversations and referrals.',
    examples: ['Meetups', 'Open-source communities'],
  },
}
```

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
