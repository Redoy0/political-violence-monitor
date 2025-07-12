const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDatabase() {
  console.log('Seeding database with complete data...')

  // Clear existing data
  await prisma.incident.deleteMany()
  console.log('✅ Cleared existing incidents')

  // Sample incidents with perpetratorRole data
  const sampleIncidents = [
    {
      title: 'ঢাকায় আওয়ামী লীগ কর্মীদের হামলায় ৫ জন আহত',
      location: 'ঢাকা',
      latitude: 23.8103,
      longitude: 90.4125,
      injured: 5,
      killed: 0,
      politicalParty: 'আওয়ামী লীগ',
      perpetratorRole: 'aggressor',
      date: new Date('2024-01-15'),
      severity: 'medium',
      description: 'ঢাকার গুলিস্তানে আওয়ামী লীগ কর্মীরা বিরোধী দলের মিছিলে হামলা করে ৫ জন আহত করেছে।',
      sourceUrl: 'https://example.com/news/1',
      images: JSON.stringify([])
    },
    {
      title: 'চট্টগ্রামে বিএনপি কর্মীদের সহিংসতায় ১ জন নিহত',
      location: 'চট্টগ্রাম',
      latitude: 22.3569,
      longitude: 91.7832,
      injured: 3,
      killed: 1,
      politicalParty: 'বিএনপি',
      perpetratorRole: 'aggressor',
      date: new Date('2024-01-10'),
      severity: 'severe',
      description: 'চট্টগ্রামে বিএনপি কর্মীরা প্রতিপক্ষের উপর হামলা চালিয়ে ১ জন নিহত ও ৩ জন আহত করেছে।',
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
      description: 'সিলেটের বিশ্ববিদ্যালয় এলাকায় ছাত্রলীগ ও অন্য ছাত্র সংগঠনের মধ্যে সংঘর্ষ।',
      sourceUrl: 'https://example.com/news/3',
      images: JSON.stringify([])
    },
    {
      title: 'রাজশাহীতে জামায়াত কর্মীদের সহিংসতা',
      location: 'রাজশাহী',
      latitude: 24.3745,
      longitude: 88.6042,
      injured: 2,
      killed: 0,
      politicalParty: 'জামায়াতে ইসলামী',
      perpetratorRole: 'aggressor',
      date: new Date('2024-01-05'),
      severity: 'light',
      description: 'রাজশাহীতে জামায়াতে ইসলামী কর্মীরা হরতাল পালনকালে পুলিশের উপর হামলা করে।',
      sourceUrl: 'https://example.com/news/4',
      images: JSON.stringify([])
    },
    {
      title: 'খুলনায় জাতীয় পার্টির নির্বাচনী সহিংসতা',
      location: 'খুলনা',
      latitude: 22.8456,
      longitude: 89.5403,
      injured: 6,
      killed: 2,
      politicalParty: 'জাতীয় পার্টি',
      perpetratorRole: 'aggressor',
      date: new Date('2024-01-12'),
      severity: 'severe',
      description: 'খুলনায় জাতীয় পার্টি কর্মীরা নির্বাচনের দিন প্রতিপক্ষের উপর হামলা করে ২ জন নিহত করে।',
      sourceUrl: 'https://example.com/news/5',
      images: JSON.stringify([])
    },
    {
      title: 'ময়মনসিংহে এনসিপি কর্মীদের হামলা',
      location: 'ময়মনসিংহ',
      latitude: 24.7471,
      longitude: 90.4203,
      injured: 7,
      killed: 1,
      politicalParty: 'এনসিপি',
      perpetratorRole: 'aggressor',
      date: new Date('2024-01-18'),
      severity: 'heavy',
      description: 'ময়মনসিংহে এনসিপি কর্মীরা অন্য দলের কর্মীদের উপর হামলা করে ১ জন নিহত করে।',
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
      name: 'Ittefaq',
      url: 'https://www.ittefaq.com.bd/politics',
      isActive: true
    },
    {
      name: 'Kaler Kantho',
      url: 'https://www.kalerkantho.com/politics',
      isActive: true
    },
    {
      name: 'Jugantor',
      url: 'https://www.jugantor.com/politics',
      isActive: true
    },
    {
      name: 'Samakal',
      url: 'https://samakal.com/politics',
      isActive: true
    },
    {
      name: 'BD News24',
      url: 'https://bangla.bdnews24.com/politics',
      isActive: true
    },
    {
      name: 'Dainik Bangla',
      url: 'https://www.dainikbangla.com/politics',
      isActive: true
    },
    {
      name: 'BD Pratidin',
      url: 'https://www.bd-pratidin.com/politics',
      isActive: true
    },
    {
      name: 'Manab Zamin',
      url: 'https://mzamin.com/category/politics',
      isActive: true
    },
    {
      name: 'Naya Diganta',
      url: 'https://www.nayadiganta.com/politics',
      isActive: true
    },
    {
      name: 'Bangladesh Pratidin',
      url: 'https://www.bd-pratidin.com/politics',
      isActive: true
    }
  ]

  // Create incidents
  for (const incident of sampleIncidents) {
    await prisma.incident.create({
      data: incident
    })
  }

  console.log(`✅ Created ${sampleIncidents.length} sample incidents with perpetrator roles`)

  // Update news sources
  for (const source of newsSources) {
    await prisma.newsSource.upsert({
      where: { url: source.url },
      update: source,
      create: source
    })
  }

  console.log(`✅ Updated ${newsSources.length} news sources`)
  console.log('🎉 Database seeded successfully with complete data!')
}

seedDatabase()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
