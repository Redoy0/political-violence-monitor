const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Function to calculate text similarity
function calculateSimilarity(str1, str2) {
  const words1 = str1.toLowerCase().split(/\s+/)
  const words2 = str2.toLowerCase().split(/\s+/)
  
  const commonWords = words1.filter(word => words2.includes(word))
  const totalWords = Math.max(words1.length, words2.length)
  
  return commonWords.length / totalWords
}

async function removeDuplicateIncidents() {
  console.log('🔍 Searching for duplicate incidents...')
  
  try {
    const allIncidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' }
    })

    console.log(`📊 Found ${allIncidents.length} total incidents`)

    const duplicates = []
    const processed = new Set()

    for (let i = 0; i < allIncidents.length; i++) {
      if (processed.has(allIncidents[i].id)) continue

      const current = allIncidents[i]
      
      for (let j = i + 1; j < allIncidents.length; j++) {
        if (processed.has(allIncidents[j].id)) continue

        const compare = allIncidents[j]
        
        // Check for duplicates based on:
        // 1. Similar titles (70% similarity)
        // 2. Same location
        // 3. Same date (within 1 day)
        const titleSimilarity = calculateSimilarity(current.title, compare.title)
        const sameLocation = current.location === compare.location
        const dateDiff = Math.abs(new Date(current.date) - new Date(compare.date)) / (1000 * 60 * 60 * 24)
        
        if (titleSimilarity > 0.7 && sameLocation && dateDiff <= 1) {
          duplicates.push({
            keep: current,
            remove: compare,
            similarity: titleSimilarity
          })
          processed.add(compare.id)
        }
      }
      
      processed.add(current.id)
    }

    console.log(`🔍 Found ${duplicates.length} duplicate incidents`)

    if (duplicates.length > 0) {
      console.log('\n📋 Duplicate incidents to be removed:')
      duplicates.forEach((dup, index) => {
        console.log(`${index + 1}. REMOVE: "${dup.remove.title}" (${dup.remove.location})`)
        console.log(`   KEEP:   "${dup.keep.title}" (${dup.keep.location})`)
        console.log(`   Similarity: ${(dup.similarity * 100).toFixed(1)}%\n`)
      })

      // Remove duplicates
      const removeIds = duplicates.map(dup => dup.remove.id)
      
      const deleteResult = await prisma.incident.deleteMany({
        where: {
          id: { in: removeIds }
        }
      })

      console.log(`✅ Removed ${deleteResult.count} duplicate incidents`)
    } else {
      console.log('✅ No duplicate incidents found')
    }

    // Also remove incidents with unclear responsibility
    const unclearIncidents = await prisma.incident.findMany({
      where: {
        OR: [
          { politicalParty: 'অজানা' },
          { politicalParty: '' }
        ]
      }
    })

    if (unclearIncidents.length > 0) {
      console.log(`\n🔍 Found ${unclearIncidents.length} incidents with unclear political responsibility`)
      
      await prisma.incident.deleteMany({
        where: {
          OR: [
            { politicalParty: 'অজানা' },
            { politicalParty: '' }
          ]
        }
      })

      console.log(`✅ Removed ${unclearIncidents.length} incidents with unclear responsibility`)
    }

    const finalCount = await prisma.incident.count()
    console.log(`\n📊 Final incident count: ${finalCount}`)

  } catch (error) {
    console.error('❌ Error removing duplicates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeDuplicateIncidents()
