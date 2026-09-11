# Campus Knowledge Hub

Public learning mirror for campus recruiting preparation.

## Live site

https://leeergou996.github.io/campus-knowledge-hub/

## Publishing model

The private repository `campus-recruiting-hub` remains the authoritative source of truth. This public repository is only a deployable learning mirror for GitHub Pages.

Mirror only the explicit public whitelist:

- `site/**`
- `learning/amazon-sa-oa/**`
- `.github/workflows/pages.yml`

Never mirror private recruiting data, including:

- `applications/**`
- `jobs/**`
- `integrations/**`
- Gmail/email content
- candidate pools, timelines, application status or personal recruiting notes

## Current module

Amazon Solutions Architect OA 4-day sprint.

Publishing flow:

```text
private campus-recruiting-hub
    ↓ update canonical knowledge/UI
whitelist mirror
    ↓
public campus-knowledge-hub
    ↓ GitHub Actions
GitHub Pages
```
