## What

<!-- One or two sentences: what does this PR change? -->

## Why

<!-- Link the issue or explain the motivation. -->

## How to test

1.
2.

## Checklist

- [ ] CI is green (format, lint, typecheck, tests, build)
- [ ] Schema changes: ran `npm run codegen`, and added a Prisma migration if the DB changed
- [ ] New resolvers validate input and check auth where needed
- [ ] No N+1 queries introduced (lists → batched lookups)
- [ ] Tests added or updated for new behaviour
- [ ] No secrets or `.env` values committed
