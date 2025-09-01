![hero](apps/public/public/ogimage.jpg)

<p align="center">
	<h1 align="center"><b>AGS Analytics</b></h1>
<p align="center">
    Self-Serve Analytics for SaaS Growth Agencies
    <br />
    <br />
    <a href="https://agsanalytics.com">Website</a>
    ·
    <a href="https://docs.agsanalytics.com">Docs</a>
    ·
    <a href="https://app.agsanalytics.com">Sign in</a>
    ·
    <a href="https://discord.gg/agsanalytics">Discord</a>
    ·
    <a href="https://twitter.com/AGSAnalytics">X/Twitter</a>
    ·
    <a href="https://artisanstrategies.com">Artisan Strategies</a>
    ·
  </p>
  <br />
  <br />
</p>

AGS Analytics is an open-source analytics platform specialized for optimizing self-serve user flows in SaaS products. Built for growth agencies, it provides real-time insights into registration, payment, and activation bottlenecks with pre-built templates and lead-generation tools.

## Disclaimer

> Hey folks 👋🏻 Just a friendly heads-up: This is a specialized fork of OpenPanel optimized for self-serve analytics. We've enhanced it with agency-focused features while maintaining the core analytics functionality. Everything is production-ready!

## Stack

- **Nextjs** - the dashboard
- **Fastify** - event api
- **Postgres** - storing basic information
- **Clickhouse** - storing events
- **Redis** - cache layer, pub/sub and queue
- **BullMQ** - queue
- **Resend** - email
- **Arctic** - oauth
- **Oslo** - auth
- **tRPC** - api
- **Tailwind** - styling
- **Shadcn** - ui

## Self-hosting

AGS Analytics can be self-hosted and we've made it simple for agencies to deploy.

You can find the how to [here](https://docs.agsanalytics.com/self-hosting)

**Give us a star if you like it!**

[![Star History Chart](https://api.star-history.com/svg?repos=ArtisanStrategies/ags-analytics&type=Date)](https://star-history.com/#ArtisanStrategies/ags-analytics&Date)

## Development

### Prerequisites

- Docker
- Docker Compose
- Node
- pnpm

### Setup

Add the following to your hosts file (`/etc/hosts` on mac/linux or `C:\Windows\System32\drivers\etc\hosts` on windows). This will be your local domain.

```
127.0.0.1 ags.local
127.0.0.1 api.ags.local
```

### Start

```bash
pnpm dock:up
pnpm codegen
pnpm migrate:deploy # once to setup the db
pnpm dev
```

You can now access the following:

- Dashboard: https://ags.local
- API: https://api.ags.local
- Bullboard (queue): http://localhost:9999
- `pnpm dock:ch` to access clickhouse terminal
- `pnpm dock:redis` to access redis terminal