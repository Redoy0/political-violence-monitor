import axios from 'axios'
import * as cheerio from 'cheerio'
import { analyzeArticleWithAI } from './ai-analyzer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface NewsSource {
  name: string
  url: string
  selectors: {
    articles: string
    title: string
    link: string
    date?: string
    content?: string
  }
}

// Default news sources - can be configured via database
const DEFAULT_SOURCES: NewsSource[] = [
  {
    name: 'Prothom Alo',
    url: 'https://www.prothomalo.com/politics',
    selectors: {
      articles: 'article',
      title: 'h2 a, h3 a',
      link: 'h2 a, h3 a',
      date: '.time',
      content: '.story-element-text'
    }
  },
  {
    name: 'Daily Star',
    url: 'https://www.thedailystar.net/politics',
    selectors: {
      articles: '.story-card',
      title: '.story-title a',
      link: '.story-title a',
      date: '.time-stamp',
      content: '.story-content'
    }
  },
  {
    name: 'Kaler Kantho',
    url: 'https://www.kalerkantho.com/politics',
    selectors: {
      articles: '.news-item',
      title: '.news-title a',
      link: '.news-title a',
      date: '.news-time',
      content: '.news-details'
    }
  },
  {
    name: 'Dainik Bangla',
    url: 'https://www.dainikbangla.com/politics',
    selectors: {
      articles: '.news-content, .post-item',
      title: 'h2 a, h3 a, .title a',
      link: 'h2 a, h3 a, .title a',
      date: '.date, .time',
      content: '.post-content, .news-details'
    }
  },
  {
    name: 'Dhaka Tribune',
    url: 'https://www.dhakatribune.com/politics',
    selectors: {
      articles: '.story-card, .news-item',
      title: '.story-title a, h2 a',
      link: '.story-title a, h2 a',
      date: '.story-time, .date-time',
      content: '.story-content'
    }
  },
  {
    name: 'Daily Manab Zamin',
    url: 'https://mzamin.com/category.php?cat=2',
    selectors: {
      articles: '.news-item, .story-wrapper',
      title: '.news-title a, h2 a',
      link: '.news-title a, h2 a',
      date: '.news-date, .time',
      content: '.news-content'
    }
  },
  {
    name: 'Protidiner Sangbad',
    url: 'https://www.protidinersangbad.com/politics',
    selectors: {
      articles: '.news-box, .article-item',
      title: '.news-title a, h3 a',
      link: '.news-title a, h3 a',
      date: '.news-time, .date',
      content: '.news-details'
    }
  },
  {
    name: 'Jugantor',
    url: 'https://www.jugantor.com/politics',
    selectors: {
      articles: '.news-item, .story-card',
      title: '.title a, h2 a',
      link: '.title a, h2 a',
      date: '.date-time, .time',
      content: '.story-content, .details'
    }
  },
  {
    name: 'Daily Naya Diganta',
    url: 'https://www.dailynayadiganta.com/politics',
    selectors: {
      articles: '.news-wrapper, .article-box',
      title: '.news-title a, h2 a',
      link: '.news-title a, h2 a',
      date: '.publish-time, .date',
      content: '.news-content'
    }
  },
  {
    name: 'Ittefaq',
    url: 'https://www.ittefaq.com.bd/politics',
    selectors: {
      articles: '.news-item, .story-wrapper',
      title: '.news-headline a, h2 a',
      link: '.news-headline a, h2 a',
      date: '.news-time, .date-time',
      content: '.news-details, .story-content'
    }
  },
  {
    name: 'Bangladesh Pratidin',
    url: 'https://www.bd-pratidin.com/politics',
    selectors: {
      articles: '.news-content, .article-wrapper',
      title: '.news-title a, h2 a',
      link: '.news-title a, h2 a',
      date: '.news-date, .time-stamp',
      content: '.news-body, .article-content'
    }
  }
]

export interface ScrapingResult {
  totalArticles: number
  incidents: number
  errors: string[]
  processedSources: string[]
}

export async function scrapeNewsWebsites(customSources?: NewsSource[]): Promise<ScrapingResult> {
  const sources = customSources || DEFAULT_SOURCES
  const result: ScrapingResult = {
    totalArticles: 0,
    incidents: 0,
    errors: [],
    processedSources: []
  }

  for (const source of sources) {
    try {
      console.log(`Scraping ${source.name}...`)
      const articles = await scrapeSource(source)
      result.totalArticles += articles.length
      result.processedSources.push(source.name)

      // Process each article with AI
      for (const article of articles) {
        try {
          const analysis = await analyzeArticleWithAI(article.content, article.title)
          
          // Only process incidents where we have clear political violence and responsibility
          if (analysis.isViolentPolitical && 
              analysis.confidence >= 0.6 && 
              analysis.politicalParty !== 'অজানা') {
            await saveIncident(analysis, article, source.name)
            result.incidents++
          } else {
            console.log(`Filtered out: ${article.title} (confidence: ${analysis.confidence}, party: ${analysis.politicalParty})`)
          }
        } catch (error) {
          console.error(`Error analyzing article: ${article.title}`, error)
          result.errors.push(`Analysis error for ${article.title}: ${error}`)
        }
      }

      // Add delay between sources to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))

    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error)
      result.errors.push(`${source.name}: ${error}`)
    }
  }

  return result
}

async function scrapeSource(source: NewsSource) {
  const articles: any[] = []
  
  try {
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      },
      timeout: 10000
    })

    const $ = cheerio.load(response.data)

    $(source.selectors.articles).each((index, element) => {
      const $article = $(element)
      
      const titleElement = $article.find(source.selectors.title).first()
      const title = titleElement.text().trim()
      
      let link = titleElement.attr('href') || $article.find(source.selectors.link).attr('href')
      
      // Handle relative URLs
      if (link && !link.startsWith('http')) {
        const baseUrl = new URL(source.url).origin
        link = new URL(link, baseUrl).href
      }

      const date = source.selectors.date 
        ? $article.find(source.selectors.date).text().trim()
        : new Date().toISOString()

      if (title && link && title.length > 10) {
        articles.push({
          title,
          link,
          date,
          content: title, // Will be fetched separately if needed
          source: source.name
        })
      }
    })

    // Fetch full content for each article
    for (const article of articles.slice(0, 20)) { // Limit to first 20 articles
      try {
        const contentResponse = await axios.get(article.link, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 8000
        })
        
        const $content = cheerio.load(contentResponse.data)
        
        // Try different selectors for content
        const contentSelectors = [
          source.selectors.content,
          '.story-element-text',
          '.article-content',
          '.news-content',
          '.post-content',
          'p'
        ].filter(Boolean)

        let fullContent = ''
        for (const selector of contentSelectors) {
          const content = $content(selector).map((i, el) => $content(el).text()).get().join(' ')
          if (content.length > fullContent.length) {
            fullContent = content
          }
        }

        article.content = fullContent.trim() || article.title
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.log(`Could not fetch content for: ${article.title}`)
        article.content = article.title
      }
    }

  } catch (error) {
    console.error(`Error fetching ${source.url}:`, error)
    throw error
  }

  return articles
}

async function saveIncident(analysis: any, article: any, sourceName: string) {
  try {
    // Only save incidents where we have a clear aggressor
    if (analysis.perpetratorRole !== 'aggressor' && analysis.confidence < 0.7) {
      console.log(`Skipping incident (unclear responsibility): ${article.title}`)
      return
    }

    // Check for duplicates based on title similarity and location
    const existingIncidents = await prisma.incident.findMany({
      where: {
        location: analysis.location || 'অজানা',
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Within last 7 days
        }
      }
    })

    // Check for similar titles (simple similarity check)
    const isDuplicate = existingIncidents.some(existing => {
      const similarity = calculateSimilarity(existing.title, article.title)
      return similarity > 0.7 // 70% similarity threshold
    })

    if (isDuplicate) {
      console.log(`Duplicate incident detected, skipping: ${article.title}`)
      return
    }

    await prisma.incident.create({
      data: {
        title: article.title,
        location: analysis.location || 'অজানা',
        latitude: analysis.coordinates?.[0] || 23.6850, // Default to Dhaka
        longitude: analysis.coordinates?.[1] || 90.3563,
        injured: analysis.casualties?.injured || 0,
        killed: analysis.casualties?.killed || 0,
        politicalParty: analysis.politicalParty || 'অজানা',
        date: new Date(article.date || new Date()),
        severity: analysis.severity || 'medium',
        description: analysis.description || article.content.substring(0, 500),
        sourceUrl: article.link,
        images: JSON.stringify(analysis.images || [])
      }
    })
    
    console.log(`Saved incident: ${article.title} (${analysis.politicalParty} - ${analysis.perpetratorRole})`)
  } catch (error) {
    console.error('Error saving incident:', error)
    throw error
  }
}

// Function to calculate text similarity
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().split(/\s+/)
  const words2 = str2.toLowerCase().split(/\s+/)
  
  const commonWords = words1.filter(word => words2.includes(word))
  const totalWords = Math.max(words1.length, words2.length)
  
  return commonWords.length / totalWords
}

// Function to get coordinates from location name
export async function getCoordinatesFromLocation(location: string): Promise<[number, number] | null> {
  try {
    // This is a simple implementation - in production, use a proper geocoding service
    const knownLocations: Record<string, [number, number]> = {
      'ঢাকা': [23.8103, 90.4125],
      'চট্টগ্রাম': [22.3569, 91.7832],
      'সিলেট': [24.8949, 91.8687],
      'রাজশাহী': [24.3745, 88.6042],
      'খুলনা': [22.8456, 89.5403],
      'বরিশাল': [22.7010, 90.3535],
      'রংপুর': [25.7439, 89.2752],
      'ময়মনসিংহ': [24.7471, 90.4203]
    }

    // Check for exact matches first
    for (const [city, coords] of Object.entries(knownLocations)) {
      if (location.includes(city)) {
        return coords
      }
    }

    // Default to Dhaka if location not found
    return [23.6850, 90.3563]
  } catch (error) {
    console.error('Error getting coordinates:', error)
    return [23.6850, 90.3563]
  }
}
