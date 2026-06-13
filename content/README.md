# NETHEX content

Data-driven catalogue for the platform. Content is authored as JSON/MDX and
validated against the shared schema (`app/src/lib/types.ts`).

## Files

| File | Visibility | Purpose |
|------|-----------|---------|
| `catalog.json` | public | Canonical paths/modules/rooms/tasks served by the API at `/content/catalog`. |
| `answers.json` | **server-side only** | Canonical flag/answer values. The API hashes these (salted SHA-256) at load and **never** returns plaintext. In production, store only hashes and inject via a secret manager. |
| `README.md` | — | This document. |

## Schema (summary)

```
LearningPath → Module[] → Room[] → Task[] → Question[]
Room may carry a LabProfile describing the Docker topology.
```

Entity shapes are defined once in `app/src/lib/types.ts` and mirrored by the
API's Zod validators. The frontend bundles a snapshot of this catalogue
(`app/src/data/catalog.ts`) so the app runs fully offline; the API serves the
canonical version at runtime.

## Authoring a new room

1. Add the room (and its tasks/questions) to `catalog.json` and to the bundled
   `app/src/data/catalog.ts`.
2. Add answer values to `answers.json` keyed as `"<roomId>:<questionId>"`.
3. If the room ships a lab, add a `LabProfile` and a matching image under
   `infra/labs/`.
4. Flags are validated server-side only — never embed plaintext answers in
   client code.
