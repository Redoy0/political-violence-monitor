<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Political Violence Monitor - GitHub Copilot Instructions

## Project Overview
This is a Next.js 15 application for monitoring and visualizing political violence incidents in Bangladesh. The system scrapes news websites daily, uses AI to analyze articles for violent political content, and displays incidents on an interactive map.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma with SQLite (dev) / PostgreSQL (prod)
- **Map**: Leaflet with react-leaflet
- **AI**: OpenAI GPT-3.5-turbo
- **Web Scraping**: Axios + Cheerio
- **Scheduling**: node-cron

## Code Style Guidelines
- Use TypeScript for all files
- Follow Next.js 15 App Router conventions
- Use Tailwind CSS for styling
- Write components in Bengali comments where appropriate for local context
- Use descriptive variable names in English but UI text in Bengali
- Implement proper error handling for all API calls
- Use Prisma for all database operations

## Key Features
1. **Web Scraping**: Daily crawling of Bangladeshi news sites
2. **AI Analysis**: OpenAI-powered analysis to extract incident details
3. **Interactive Map**: Leaflet map with severity-based color coding
4. **Filtering**: Date range, political party, and severity filters
5. **Statistics**: Real-time stats panel with incident breakdowns

## File Structure
- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - React components
- `/src/lib` - Utility functions (scraper, AI analyzer)
- `/prisma` - Database schema and migrations
- `/scripts` - Automation scripts (daily scraper)

## Important Notes
- All UI text should be in Bengali for local users
- Map coordinates are based on Bangladesh geography
- AI prompts are configured for Bengali news analysis
- Default location is Dhaka (23.6850, 90.3563)
- Severity levels: light (হালকা), medium (মধ্যম), heavy (ভারী), severe (গুরুতর)

## API Endpoints
- `GET /api/incidents` - Fetch all incidents
- `POST /api/incidents` - Create new incident
- `POST /api/scrape` - Trigger manual scraping

## Environment Variables Required
- `OPENAI_API_KEY` - For AI analysis
- `DATABASE_URL` - Database connection
- `NEXTAUTH_SECRET` - For authentication (if implemented)

## Common Patterns
- Use `'use client'` directive for interactive components
- Implement loading states for all async operations
- Use proper TypeScript interfaces for data structures
- Handle both Bengali and English text in analysis
- Implement proper error boundaries and fallbacks
