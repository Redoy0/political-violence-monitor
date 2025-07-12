const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyData() {
  try {
    console.log('🔍 Verifying Political Violence Monitor Data...\n')
    
    // Get all incidents
    const incidents = await prisma.incident.findMany()
    console.log(`📊 Total incidents in database: ${incidents.length}`)
    
    // Check for political party involvement
    const politicalIncidents = incidents.filter(incident => 
      incident.perpetratorRole === 'political_party_member' || 
      incident.perpetratorRole === 'opposition_party_member' ||
      incident.description.toLowerCase().includes('awami league') ||
      incident.description.toLowerCase().includes('bnp') ||
      incident.description.toLowerCase().includes('ncp') ||
      incident.description.toLowerCase().includes('jatiya party')
    )
    console.log(`🏛️  Political incidents: ${politicalIncidents.length}`)
    
    // Group by political party
    const partyCount = {}
    incidents.forEach(incident => {
      const desc = incident.description.toLowerCase()
      if (desc.includes('awami league')) {
        partyCount['Awami League'] = (partyCount['Awami League'] || 0) + 1
      }
      if (desc.includes('bnp')) {
        partyCount['BNP'] = (partyCount['BNP'] || 0) + 1
      }
      if (desc.includes('ncp')) {
        partyCount['NCP'] = (partyCount['NCP'] || 0) + 1
      }
      if (desc.includes('jatiya party')) {
        partyCount['Jatiya Party'] = (partyCount['Jatiya Party'] || 0) + 1
      }
    })
    
    console.log('\n🎯 Incidents by Political Party:')
    Object.entries(partyCount).forEach(([party, count]) => {
      console.log(`   ${party}: ${count}`)
    })
    
    // Check perpetrator roles
    const roleCount = {}
    incidents.forEach(incident => {
      const role = incident.perpetratorRole || 'unknown'
      roleCount[role] = (roleCount[role] || 0) + 1
    })
    
    console.log('\n👤 Incidents by Perpetrator Role:')
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`   ${role}: ${count}`)
    })
    
    // Check date range
    const dates = incidents.map(i => new Date(i.createdAt)).sort()
    console.log(`\n📅 Date range: ${dates[0]?.toDateString()} to ${dates[dates.length-1]?.toDateString()}`)
    
    // Sample recent incidents
    console.log('\n📰 Sample Recent Incidents:')
    incidents.slice(0, 3).forEach((incident, index) => {
      console.log(`   ${index + 1}. ${incident.title}`)
      console.log(`      Location: ${incident.location}`)
      console.log(`      Role: ${incident.perpetratorRole}`)
      console.log(`      Date: ${new Date(incident.createdAt).toDateString()}\n`)
    })
    
    console.log('✅ Data verification complete!')
    
  } catch (error) {
    console.error('❌ Error verifying data:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

verifyData()
