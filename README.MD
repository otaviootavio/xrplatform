# XRPL Node Factory

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://xrplatform.vercel.app)
[![Docker Factory](https://img.shields.io/badge/github-docker--factory-blue.svg)](https://github.com/otaviootavio/docker-factory)
[![SaaS Frontend](https://img.shields.io/badge/github-saas--project-blue.svg)](https://github.com/senderro/saasproject)
[![Video Demo](https://img.shields.io/badge/video-demo-red.svg)](https://utfs.io/f/TCbmfIvnltRWAX1QnlU9UcTgfeSo4V31WOZyEpnjK5vLzBkR)

A Platform as a Service (PaaS) for deploying and managing XRP Ledger nodes using Google Cloud Run. Streamlines the process of running and maintaining XRPL validator and client nodes through container orchestration with a modern web interface.

## Key Technical Features

- Automated [XRPL node](https://xrpl.org/run-a-rippled-validator.html) deployment and configuration
- Container-based node management using Google Cloud Run
- [Docker SDK](https://docker-py.readthedocs.io/) for XRPL node containerization
- [Next.js 16](https://nextjs.org/blog/next-16) dashboard with Server Components
- [Prisma](https://www.prisma.io/) for deployment state management
- Custom `rippled.cfg` template system for node configuration
- Supervisord integration for process management within containers

## Notable Dependencies & Technologies

- [rippled](https://github.com/XRPLF/rippled) - XRP Ledger server implementation
- [Cloud Run Client Library](https://googleapis.dev/python/run/latest/index.html) for GCP deployments
- [Next.js 16](https://nextjs.org/) with TypeScript
- [shadcn/ui](https://ui.shadcn.com/) for dashboard components
- [Docker Python SDK](https://docker-py.readthedocs.io/)
- [Prisma ORM](https://www.prisma.io/)
- [Geist](https://vercel.com/font) font integration

## Project Structure
```
.
├── docker-factory/         # XRPL node container service
│   ├── api/               # FastAPI endpoints
│   ├── src/               # Core node deployment logic
│   │   ├── clients/       # External service clients
│   │   ├── services/      # Node orchestration logic
│   │   └── templates/     # XRPL node templates
│   └── tests/             # Test suite
└── saasproject/           # Node management dashboard
    ├── src/
    │   ├── app/          # Next.js app directory
    │   ├── components/   # Dashboard components
    │   ├── lib/          # Shared utilities
    │   └── repositories/ # Node state management
    └── prisma/           # Database schema
```

### Key Directories

- `docker-factory/src/services/`: XRPL node orchestration and lifecycle management
- `docker-factory/src/templates/`: Configuration templates for rippled nodes
- `saasproject/src/app/`: Node management interface and monitoring
- `saasproject/src/components/ui/`: Dashboard component library