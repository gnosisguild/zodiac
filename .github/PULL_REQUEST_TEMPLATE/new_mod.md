---
name: Add a new mod
about: Request to add a new module, modifier, or guard to this repo.
title: ''
labels: 'enhancement'
assignees: 'auryn-macmillan'

---

**Title**
What is your module called?

**Description**
A brief description of what your module does.

**Audit**
Link to an audit of your module's code, performed be a reputable auditor.

**Checklist**
Prior to being merged, your PR must:

- [ ] Add details of your module to the [README](../../README.md) (items are sorted alphabetically)
- [ ] Add addresses of the canonical deployments of the mastercopy for your module to [deployments.json](../../src/deployments.json), along with addresses and ABI details to [constants.ts](../../src/factory/constants.ts). Ideally these should be deterministic deployments that can be easily replicated on other supported networks.
- [ ] Include an audit from a reputable auditor.