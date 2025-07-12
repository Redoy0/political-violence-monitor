import { NextRequest, NextResponse } from 'next/server'
import { scrapeNewsWebsites } from '@/lib/scraper'

export async function POST(request: NextRequest) {
  try {
    const { websites } = await request.json()
    
    console.log('Starting scraping process...')
    const results = await scrapeNewsWebsites(websites)
    
    return NextResponse.json({
      success: true,
      message: `Scraped ${results.totalArticles} articles, found ${results.incidents} potential incidents`,
      results
    })
  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to scrape websites' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Scraper API endpoint. Use POST to trigger scraping.',
    endpoints: {
      trigger: '/api/scrape (POST)',
      status: '/api/scrape/status (GET)'
    }
  })
}
