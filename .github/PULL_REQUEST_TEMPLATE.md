# New PR guide

Please choose one of the below templates for your PR, feel free to delete any redundant information.

## Add a feature

### Feature Request

_Link to any corresponding issue(s) describing the feature request(s)._

### Implementation

_A concise description of the implementation(s)._

### Additional Context

_Add any other context about the implementation(s) here._

---

## Fix a bug

### Bug Report

_Link to any corresponding issue(s) describing the bug(s)._

### Implementation

_A concise description of the implemented solution(s) to the reported bug(s)._

### Additional Context

_Add any other context about the implementation here._

---

## Add a module to this repo

### Title

_What is your module called?_

### Description

_A brief description of what your module does._

### Audit

_Link to an audit of your module's code, performed be a reputable auditor._

### Checklist

_Prior to being merged, this PR must meet the following requirements._

This PR:

- [ ] Adds details of the module to the [README](../../README.md) (items are sorted alphabetically)
- [ ] Adds addresses of the canonical deployments of the mastercopy for your module to [deployments.json](../../src/deployments.json), along with addresses and ABI details to [constants.ts](../../src/factory/constants.ts). Ideally these should be deterministic deployments that can be easily replicated on other supported networks.
- [ ] Includes an audit from a reputable auditor.
