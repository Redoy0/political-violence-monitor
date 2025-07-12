const { scrapeNewsWebsites } = require('../src/lib/scraper')

async function testScraper() {
  console.log('🔍 Testing news scraper with updated sources...')
  console.log('📰 Sources include: Dainik Bangla, Dhaka Tribune, Daily Manab Zamin, etc.')
  
  try {
    const result = await scrapeNewsWebsites()
    
    console.log('\n📊 Scraping Results:')
    console.log(`✅ Total articles found: ${result.totalArticles}`)
    console.log(`🔥 Political violence incidents detected: ${result.incidents}`)
    console.log(`📰 Sources processed: ${result.processedSources.join(', ')}`)
    
    if (result.errors.length > 0) {
      console.log('\n⚠️ Errors encountered:')
      result.errors.forEach(error => console.log(`  - ${error}`))
    }
    
    console.log('\n✨ Scraper test completed!')
    
  } catch (error) {
    console.error('❌ Scraper test failed:', error.message)
  }
}

testScraper()
