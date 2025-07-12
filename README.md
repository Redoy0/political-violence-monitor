# Political Violence Monitor

A Next.js application for monitoring and visualizing political violence incidents in Bangladesh, tracking incidents where political parties are perpetrators of violence.

## 🎯 Purpose

This application specifically monitors incidents where political parties are **perpetrators** (committers) of violence, not just participants or victims. For example:
- ✅ "BNP workers attacked protesters" → Counts as BNP incident  
- ❌ "Protesters attacked BNP office" → Does NOT count as BNP incident

## � Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Map Visualization**: Leaflet with react-leaflet
- **AI Analysis**: OpenAI GPT-3.5-turbo
- **Web Scraping**: Axios + Cheerio

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Redoy0/political-violence-monitor.git
cd political-violence-monitor
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Copy the example environment file and configure it:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL="file:./prisma/dev.db"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page
│   ├── components/         # React components
│   │   ├── IncidentFilters.tsx
│   │   ├── IncidentList.tsx
│   │   ├── MapVisualization.tsx
│   │   ├── StatisticsPanel.tsx
│   │   └── Footer.tsx
│   └── lib/               # Utility functions
│       ├── ai-analyzer.ts  # OpenAI integration
│       ├── scraper.ts     # Web scraping
│       └── date-utils.ts  # Date formatting
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── dev.db            # SQLite database (auto-generated)
├── scripts/
│   └── seed.js           # Database seeding script
└── public/               # Static files
```

## �️ Database Schema

The main `Incident` model includes:
- Basic info: title, location, coordinates
- Casualties: injured/killed counts
- **Political Party**: The perpetrator party
- **Perpetrator Role**: aggressor/defender/unclear
- Severity: light/medium/heavy/severe
- Metadata: date, description, source URL

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run seed         # Seed database with sample data
npx prisma studio    # Open database browser
npx prisma migrate dev  # Run migrations

# Database Management
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
```

## 🌐 API Endpoints

- `GET /api/incidents` - Fetch all incidents
- `POST /api/incidents` - Create new incident
- `POST /api/scrape` - Trigger manual scraping

## 🔍 Features

### 📊 Real-time Statistics
- Total incidents count
- Casualties breakdown (killed/injured)
- Incidents by perpetrator party
- Severity distribution

### 🗺️ Interactive Map
- Visual incident markers
- Color-coded by severity
- Click for incident details
- Geographic distribution

### 🔍 Advanced Filtering
- Date range selection
- Filter by perpetrator party
- Severity level filtering
- Expand/collapse interface

### 📱 Responsive Design
- Mobile-optimized interface
- Compact sidebar layout
- Touch-friendly interactions
- Works on all screen sizes

## 🤖 AI Analysis

The system uses OpenAI GPT-3.5-turbo to:
1. Analyze Bengali news articles
2. Identify political violence incidents
3. Determine perpetrator parties (not victims)
4. Extract casualties and severity
5. Assign confidence scores

## 📰 News Sources

Currently monitoring 11 Bangladeshi news portals:
- Prothom Alo
- Ittefaq
- Kaler Kantho
- Jugantor
- Samakal
- BD News24
- Dainik Bangla
- BD Pratidin
- Manab Zamin
- Naya Diganta
- Bangladesh Pratidin

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
1. Build the project: `npm run build`
2. Set up PostgreSQL database for production
3. Update `DATABASE_URL` environment variable
4. Deploy the `out/` folder

## 🔒 Environment Variables

Required for production:
```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_connection_string
NEXTAUTH_SECRET=your_auth_secret (optional)
```

## 👥 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developers

- **Sabbir Ahamed** - Lead Developer
- **Shakib Howlader** - Co-Developer  
- **Syed Sabbir** - Co-Developer

---

## ❓ FAQ

### Q: Why is `node_modules` not in the repository?
A: `node_modules` is automatically generated when you run `npm install`. It contains all the dependencies and can be very large (100s of MBs). It's excluded via `.gitignore` to keep the repository size small.

### Q: What files should I NOT upload to GitHub?
A: These are automatically excluded by `.gitignore`:
- `node_modules/` - Dependencies  
- `.next/` - Build cache
- `.env.local` - Environment variables
- `*.db` - Database files
- Build artifacts and logs

### Q: How do others run my project?
A: They just need to:
1. Clone the repo
2. Run `npm install` (this downloads `node_modules`)
3. Set up `.env.local`  
4. Run `npm run dev`

The `package.json` file tells npm which dependencies to download, so `node_modules` is recreated automatically.

---

**Note**: This application specifically tracks political violence where parties are perpetrators, not victims. Each incident is carefully analyzed to ensure accurate attribution of responsibility.
2. ম্যাপে রাজনৈতিক সহিংসতার ঘটনাগুলো দেখুন
3. বাম সাইডবারে ফিল্টার ব্যবহার করুন
4. মার্কারে ক্লিক করে বিস্তারিত তথ্য দেখুন

### ম্যানুয়াল স্ক্র্যাপিং
API এন্ডপয়েন্ট ব্যবহার করে ম্যানুয়াল স্ক্র্যাপিং:
\`\`\`bash
curl -X POST http://localhost:3000/api/scrape
\`\`\`

### স্বয়ংক্রিয় দৈনিক স্ক্র্যাপিং
দৈনিক স্ক্র্যাপিং সক্রিয় করতে:
\`\`\`bash
node scripts/daily-scraper.js
\`\`\`

## API এন্ডপয়েন্ট

- `GET /api/incidents` - সব ঘটনার তালিকা
- `POST /api/incidents` - নতুন ঘটনা যোগ করা
- `POST /api/scrape` - ম্যানুয়াল স্ক্র্যাপিং ট্রিগার

## কনফিগারেশন

### নিউজ সোর্স যোগ করা
`src/lib/scraper.ts` ফাইলে `DEFAULT_SOURCES` অ্যারেতে নতুন নিউজ সোর্স যোগ করুন:

\`\`\`typescript
{
  name: 'News Site Name',
  url: 'https://example.com/politics',
  selectors: {
    articles: '.article-item',
    title: '.article-title a',
    link: '.article-title a',
    date: '.article-date',
    content: '.article-content'
  }
}
\`\`\`

### AI প্রম্পট কাস্টমাইজেশন
`src/lib/ai-analyzer.ts` ফাইলে AI প্রম্পট এবং কীওয়ার্ড তালিকা পরিবর্তন করুন।

## ডিপ্লয়মেন্ট

### Vercel (সুপারিশকৃত)
1. GitHub এ কোড পুশ করুন
2. Vercel এ ইমপোর্ট করুন
3. Environment variables সেট করুন
4. ডিপ্লয় করুন

### Docker
\`\`\`bash
docker build -t political-violence-monitor .
docker run -p 3000:3000 political-violence-monitor
\`\`\`

## নিরাপত্তা

- সব API কী secure রাখুন
- Production এ HTTPS ব্যবহার করুন
- Rate limiting implementকরুন
- Database access সুরক্ষিত করুন

## অবদান রাখা

1. Repository fork করুন
2. Feature branch তৈরি করুন (`git checkout -b feature/AmazingFeature`)
3. Changes commit করুন (`git commit -m 'Add some AmazingFeature'`)
4. Branch এ push করুন (`git push origin feature/AmazingFeature`)
5. Pull Request খুলুন

## লাইসেন্স

এই প্রজেক্টটি MIT লাইসেন্সের অধীনে লাইসেন্সপ্রাপ্ত।

## সাপোর্ট

সমস্যা বা প্রশ্নের জন্য GitHub Issues ব্যবহার করুন।

---

**সতর্কতা**: এই টুলটি শুধুমাত্র গবেষণা এবং সচেতনতার উদ্দেশ্যে তৈরি। সব তথ্য যাচাই করুন এবং দায়িত্বশীলভাবে ব্যবহার করুন।
