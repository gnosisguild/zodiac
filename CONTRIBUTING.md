# Contributing to Gnosis Guild Projects

A big welcome and thank you for considering contributing to Gnosis Guild's open source projects! It’s people like you that make it a reality for users in our community.

Reading and following these guidelines will help us make the contribution process easy and effective for everyone involved. It also communicates that you agree to respect the time of the developers managing and developing these open source projects. In return, we will reciprocate that respect by addressing your issues, assessing changes, and helping you finalize your pull requests.

## Quicklinks

- [Contributing to Gnosis Guild Projects](#contributing-to-gnosis-guild-projects)
  - [Quicklinks](#quicklinks)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
    - [Issues](#issues)
    - [Pull Requests](#pull-requests)
    - [Adding Mods To This Repo](#adding-mods-to-this-repo)
  - [Getting Help](#getting-help)

## Code of Conduct

We take our open source community seriously and hold ourselves and other contributors to high standards of communication. By participating and contributing to this project, you agree to uphold our [Code of Conduct](https://github.com/gnosis/CODE_OF_CONDUCT).

## Getting Started

Contributions are made to this repo via Issues and Pull Requests (PRs). A few general guidelines that cover both:

- To report security vulnerabilities, please responsibly disclose to [bounty@gnosis.io](mailto:bounty@gnosis.io) or via any of our [immunefi](https://immunefi.com/) bounties which are monitored by our security team.
- Search for existing Issues and PRs before creating your own.
- We work hard to makes sure issues are handled in a timely manner but, depending on the impact, it could take a while to investigate the root cause. A friendly ping in the comment thread to the submitter or a contributor can help draw attention if your issue is blocking.

### Issues

Issues should be used to report problems, request a new feature, or to discuss potential changes before a PR is created.

If you find an Issue that addresses the problem you're having, please add your own reproduction information to the existing issue rather than creating a new one. Adding a [reaction](https://github.blog/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/) can also help be indicating to our maintainers that a particular problem is affecting more than just the reporter.

### Pull Requests

PRs are always welcome and can be a quick way to get your fix or improvement slated for the next release. In general, PRs should:

- Only fix/add the functionality in question **OR** address wide-spread whitespace/style issues, not both.
- Add unit or integration tests for fixed or changed functionality (if a test suite already exists).
- Address a single concern in the least number of changed lines as possible.
- Include documentation in the repo.

For changes that address core functionality or would require breaking changes (e.g. a major release), it's best to open an Issue to discuss your proposal first. This is not required but can save time creating and reviewing changes.

Before being merged into `main`/`master`, PRs that touch any solidity files MUST include:
1. 100% test coverage.
2. Singleton deployment to all supported networks (if the resulting bytecode changes).
3. An audit from a reputable auditor (if any security relevant solidity code changes).

In general, we follow the ["fork-and-pull" Git workflow](https://github.com/susam/gitpr)

1. Fork the repository to your own Github account
2. Clone the project to your machine
3. Create a branch locally with a succinct but descriptive name
4. Commit changes to the branch
5. Following any formatting and testing guidelines specific to this repo
6. Push changes to your fork
7. Open a PR in our repository and follow the PR template so that we can efficiently review the changes.

### Adding Mods To This Repo

If you have built a mod or guard and want to add it to this repo, your PR should update the [README.md](/README.md) file (list items are sorted alphabetically), along with [constants.ts](/src/factory/constants.ts) and [types.ts](/src/factory/types.ts).

The mastercopy address provided in [constants.ts](/src/factory/constants.ts) should be a deterministic deployment that can be replayed on other networks or a canonical address should be provided for each network. Please make a companion PR to the [Zodiac Safe App](https://github.com/gnosis/zodiac-safe-app) repo if you wish for your module to also be listed in the Zodiac Safe App.

## Getting Help

Join us in the [Gnosis Guild Discord](https://discord.gg/gnosisguild) and say hi 👋.