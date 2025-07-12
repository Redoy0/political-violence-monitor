const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDatabase() {
  console.log('Seeding database with sample data...')

  // Sample incidents for testing
  const sampleIncidents = [
    {
      title: 'ঢাকায় রাজনৈতিক সংঘর্ষে ৫ জন আহত',
      location: 'ঢাকা',
      latitude: 23.8103,
      longitude: 90.4125,
      injured: 5,
      killed: 0,
      politicalParty: 'আওয়ামী লীগ',
      perpetratorRole: 'aggressor',
      date: new Date('2024-01-15'),
      severity: 'medium',
      description: 'ঢাকার গুলিস্তানে দুই দলের কর্মীদের মধ্যে সংঘর্ষে ৫ জন আহত হয়েছেন।',
      sourceUrl: 'https://example.com/news/1',
      images: JSON.stringify([])
    },
    {
      title: 'চট্টগ্রামে রাজনৈতিক মিছিলে হামলা',
      location: 'চট্টগ্রাম',
      latitude: 22.3569,
      longitude: 91.7832,
      injured: 3,
      killed: 1,
      politicalParty: 'বিএনপি',
      perpetratorRole: 'aggressor',
      date: new Date('2024-01-10'),
      severity: 'severe',
      description: 'চট্টগ্রামে বিরোধী দলের মিছিলে হামলায় ১ জন নিহত ও ৩ জন আহত।',
      sourceUrl: 'https://example.com/news/2',
      images: JSON.stringify([])
    },
    {
      title: 'সিলেটে ছাত্র সংগঠনের সংঘর্ষ',
      location: 'সিলেট',
      latitude: 24.8949,
      longitude: 91.8687,
      injured: 8,
      killed: 0,
      politicalParty: 'ছাত্রলীগ',
      perpetratorRole: 'unclear',
      date: new Date('2024-01-08'),
      severity: 'heavy',
      description: 'সিলেটের বিশ্ববিদ্যালয় এলাকায় দুই ছাত্র সংগঠনের মধ্যে সংঘর্ষ।',
      sourceUrl: 'https://example.com/news/3',
      images: JSON.stringify([])
    },
    {
      title: 'রাজশাহীতে হরতাল পালনে বিক্ষোভ',
      location: 'রাজশাহী',
      latitude: 24.3745,
      longitude: 88.6042,
      injured: 2,
      killed: 0,
      politicalParty: 'জামায়াতে ইসলামী',
      date: new Date('2024-01-05'),
      severity: 'light',
      description: 'রাজশাহীতে হরতাল পালনকালে পুলিশের সাথে বিক্ষোভকারীদের সংঘর্ষ।',
      sourceUrl: 'https://example.com/news/4',
      images: JSON.stringify([])
    },
    {
      title: 'খুলনায় নির্বাচনী সহিংসতা',
      location: 'খুলনা',
      latitude: 22.8456,
      longitude: 89.5403,
      injured: 6,
      killed: 2,
      politicalParty: 'জাতীয় পার্টি',
      date: new Date('2024-01-12'),
      severity: 'severe',
      description: 'খুলনায় স্থানীয় নির্বাচনের দিন সহিংসতায় ২ জন নিহত।',
      sourceUrl: 'https://example.com/news/5',
      images: JSON.stringify([])
    },
    {
      title: 'বরিশালে এনসিপি কর্মীদের উপর হামলা',
      location: 'বরিশাল',
      latitude: 22.7010,
      longitude: 90.3535,
      injured: 4,
      killed: 0,
      politicalParty: 'এনসিপি',
      date: new Date('2024-01-20'),
      severity: 'medium',
      description: 'বরিশালে এনসিপি কর্মীদের সমাবেশে বিরোধী দলের হামলায় ৪ জন আহত।',
      sourceUrl: 'https://www.dainikbangla.com/news/6',
      images: JSON.stringify([])
    },
    {
      title: 'ময়মনসিংহে রাজনৈতিক দলগুলোর মধ্যে সংঘাত',
      location: 'ময়মনসিংহ',
      latitude: 24.7471,
      longitude: 90.4203,
      injured: 7,
      killed: 1,
      politicalParty: 'এনসিপি',
      date: new Date('2024-01-18'),
      severity: 'heavy',
      description: 'ময়মনসিংহে এনসিপি ও অন্যান্য দলের কর্মীদের সংঘর্ষে ১ জন নিহত।',
      sourceUrl: 'https://www.bd-pratidin.com/news/7',
      images: JSON.stringify([])
    }
  ]

  // Sample news sources - updated with all requested portals
  const newsSources = [
    {
      name: 'Prothom Alo',
      url: 'https://www.prothomalo.com/politics',
      isActive: true
    },
    {
      name: 'The Daily Star',
      url: 'https://www.thedailystar.net/politics',
      isActive: true
    },
    {
      name: 'Kaler Kantho',
      url: 'https://www.kalerkantho.com/politics',
      isActive: true
    },
    {
      name: 'Dainik Bangla',
      url: 'https://www.dainikbangla.com/politics',
      isActive: true
    },
    {
      name: 'Dhaka Tribune',
      url: 'https://www.dhakatribune.com/politics',
      isActive: true
    },
    {
      name: 'Daily Manab Zamin',
      url: 'https://mzamin.com/category.php?cat=2',
      isActive: true
    },
    {
      name: 'Protidiner Sangbad',
      url: 'https://www.protidinersangbad.com/politics',
      isActive: true
    },
    {
      name: 'Jugantor',
      url: 'https://www.jugantor.com/politics',
      isActive: true
    },
    {
      name: 'Daily Naya Diganta',
      url: 'https://www.dailynayadiganta.com/politics',
      isActive: true
    },
    {
      name: 'Ittefaq',
      url: 'https://www.ittefaq.com.bd/politics',
      isActive: true
    },
    {
      name: 'Bangladesh Pratidin',
      url: 'https://www.bd-pratidin.com/politics',
      isActive: true
    }
  ]

  try {
    // Insert incidents
    for (const incident of sampleIncidents) {
      await prisma.incident.create({
        data: incident
      })
    }
    console.log(`✅ Created ${sampleIncidents.length} sample incidents`)

    // Insert news sources (upsert to handle duplicates)
    for (const source of newsSources) {
      await prisma.newsSource.upsert({
        where: { url: source.url },
        update: { isActive: source.isActive },
        create: source
      })
    }
    console.log(`✅ Updated ${newsSources.length} news sources`)

    console.log('🎉 Database seeded successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedDatabase()
