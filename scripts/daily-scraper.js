const cron = require('node-cron')
const { scrapeNewsWebsites } = require('../src/lib/scraper')

// Run daily at 6 AM Bangladesh Time
cron.schedule('0 6 * * *', async () => {
  console.log('Starting daily news scraping...')
  
  try {
    const result = await scrapeNewsWebsites()
    console.log('Scraping completed:', result)
    
    // Log results
    console.log(`Total articles processed: ${result.totalArticles}`)
    console.log(`Violence incidents found: ${result.incidents}`)
    console.log(`Errors: ${result.errors.length}`)
    
    if (result.errors.length > 0) {
      console.error('Scraping errors:', result.errors)
    }
    
  } catch (error) {
    console.error('Failed to complete daily scraping:', error)
  }
}, {
  timezone: "Asia/Dhaka"
})

console.log('Daily scraper scheduled for 6:00 AM Bangladesh Time')

// Keep the process alive
process.stdin.resume()
