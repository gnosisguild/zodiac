# New PR guide

Please choose one of the below templates for your PR, feel free to delete any redundant information.

## Add a feature

### Feature Request

*Link to any corresponding issue(s) describing the feature request(s).*

### Implementation

*A concise description of the implementation(s).*

### Additional Context

*Add any other context about the implementation(s) here.*

---

## Fix a bug

### Bug Report

*Link to any corresponding issue(s) describing the bug(s).*

### Implementation

*A concise description of the implemented solution(s) to the reported bug(s).*

### Additional Context

*Add any other context about the implementation here.*

---

## Add a module to this repo

### Title

*What is your module called?*

### Description

*A brief description of what your module does.*

### Audit

*Link to an audit of your module's code, performed be a reputable auditor.*

### Checklist

*Prior to being merged, this PR must meet the following requirements.*

This PR:

- [ ] Adds details of the module to the [README](../../README.md) (items are sorted alphabetically)
- [ ] Adds addresses of the canonical deployments of the mastercopy for your module to [deployments.json](../../src/deployments.json), along with addresses and ABI details to [constants.ts](../../src/factory/constants.ts). Ideally these should be deterministic deployments that can be easily replicated on other supported networks.
- [ ] Includes an audit from a reputable auditor.