import OpenAI from 'openai'
import { getCoordinatesFromLocation } from './scraper'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface AIAnalysisResult {
  isViolentPolitical: boolean
  location: string
  coordinates?: [number, number]
  casualties: {
    injured: number
    killed: number
  }
  politicalParty: string
  perpetratorRole: 'aggressor' | 'defender' | 'unclear'
  severity: 'light' | 'medium' | 'heavy' | 'severe'
  description: string
  images: string[]
  confidence: number
}

export async function analyzeArticleWithAI(content: string, title: string): Promise<AIAnalysisResult> {
  try {
    const prompt = `
আপনি একটি বাংলাদেশী নিউজ আর্টিকেল বিশ্লেষণ করবেন এবং রাজনৈতিক সহিংসতা সনাক্ত করবেন।

নিউজ শিরোনাম: "${title}"
নিউজ বিষয়বস্তু: "${content.substring(0, 2000)}"

অত্যন্ত গুরুত্বপূর্ণ: আমরা শুধুমাত্র সেই ঘটনাগুলি ট্র্যাক করি যেখানে একটি নির্দিষ্ট রাজনৈতিক দল সহিংসতার অপরাধী/দোষী (PERPETRATOR)। 

উদাহরণ: 
✅ "বিএনপি কর্মীরা একজনকে হত্যা করেছে" = বিএনপি দোষী
✅ "আওয়ামী লীগ কর্মীরা হামলা করেছে" = আওয়ামী লীগ দোষী
❌ "আওয়ামী লীগের উপর হামলা" = আওয়ামী লীগ দোষী নয়, ভিকটিম
❌ "বিএনপি নেতা আহত" = বিএনপি দোষী নয়, ভিকটিম

শুধুমাত্র PERPETRATOR দলটি গণনা করুন, ভিকটিম দল নয়।

নিম্নলিখিত তথ্যগুলো JSON ফরম্যাটে প্রদান করুন:

1. isViolentPolitical: এটি কি রাজনৈতিক সহিংসতার ঘটনা যেখানে একটি দল অপরাধী? (true/false)
2. location: ঘটনাটি কোথায় ঘটেছে? (বাংলায়)
3. casualties: 
   - injured: কতজন আহত হয়েছে? (সংখ্যা)
   - killed: কতজন নিহত হয়েছে? (সংখ্যা)
4. politicalParty: কোন রাজনৈতিক দল সহিংসতার অপরাধী? (বাংলায়) - শুধুমাত্র PERPETRATOR দল
5. perpetratorRole: "aggressor" (যদি দলটি হামলাকারী), "defender" (যদি আত্মরক্ষা), "unclear" (যদি অস্পষ্ট)
6. severity: সহিংসতার মাত্রা ("light", "medium", "heavy", "severe")
7. description: ঘটনার সংক্ষিপ্ত বিবরণ (বাংলায়, ১০০ শব্দের মধ্যে)
8. confidence: আপনার বিশ্লেষণে কতটা নিশ্চিত? (০-১)

শুধুমাত্র JSON রিটার্ন করুন, অন্য কোন টেক্সট নয়।

সহিংসতার মাত্রা নির্ধারণের মাপদণ্ড:
- light: হালকা ধাক্কাধাক্কি, স্লোগান
- medium: মারামারি, ভাংচুর
- heavy: গুরুতর আঘাত, অস্ত্র ব্যবহার
- severe: হত্যা, গুলি, বোমা

উদাহরণ JSON:
{
  "isViolentPolitical": true,
  "location": "ঢাকা",
  "casualties": {"injured": 5, "killed": 0},
  "politicalParty": "আওয়ামী লীগ",
  "perpetratorRole": "aggressor",
  "severity": "medium",
  "description": "আওয়ামী লীগের কর্মীরা বিরোধী দলের সমাবেশে হামলা করে ৫ জনকে আহত করে",
  "confidence": 0.85
}

দায়িত্ব নির্ধারণের নিয়ম:
- aggressor: যে দল আক্রমণ করেছে বা সহিংসতা শুরু করেছে
- defender: যে দল আত্মরক্ষা করেছে
- unclear: স্পষ্ট নয় কে দায়ী
`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'আপনি একজন নিউজ বিশ্লেষক যিনি বাংলাদেশের রাজনৈতিক সহিংসতা সনাক্ত করতে বিশেষজ্ঞ। শুধুমাত্র JSON ফরম্যাটে উত্তর দিন।'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })

    const responseText = response.choices[0].message.content?.trim()
    
    if (!responseText) {
      throw new Error('Empty response from AI')
    }

    let analysis: any
    try {
      // Clean the response text to extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : responseText
      analysis = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Response text:', responseText)
      throw new Error('Failed to parse AI response')
    }

    // Get coordinates if location is provided
    let coordinates: [number, number] | undefined
    if (analysis.location && analysis.isViolentPolitical) {
      coordinates = await getCoordinatesFromLocation(analysis.location) || undefined
    }

    return {
      isViolentPolitical: analysis.isViolentPolitical || false,
      location: analysis.location || 'অজানা',
      coordinates,
      casualties: {
        injured: parseInt(analysis.casualties?.injured) || 0,
        killed: parseInt(analysis.casualties?.killed) || 0
      },
      politicalParty: analysis.politicalParty || 'অজানা',
      perpetratorRole: analysis.perpetratorRole || 'unclear',
      severity: analysis.severity || 'medium',
      description: analysis.description || title,
      images: [], // Images will be extracted separately
      confidence: parseFloat(analysis.confidence) || 0.5
    }

  } catch (error) {
    console.error('AI Analysis error:', error)
    
    // Fallback analysis using keywords
    return fallbackAnalysis(content, title)
  }
}

// Fallback analysis using keyword matching when AI fails
function fallbackAnalysis(content: string, title: string): AIAnalysisResult {
  const text = `${title} ${content}`.toLowerCase()
  
  // Keywords for political violence detection
  const violenceKeywords = [
    'আক্রমণ', 'মারামারি', 'সংঘর্ষ', 'হামলা', 'ভাংচুর', 
    'গুলি', 'বোমা', 'নিহত', 'আহত', 'হত্যা', 'আগুন',
    'অবরোধ', 'হরতাল', 'তাণ্ডব', 'বিক্ষোভ'
  ]
  
  const politicalKeywords = [
    'আওয়ামী লীগ', 'বিএনপি', 'জামায়াত', 'জাতীয় পার্টি',
    'রাজনৈতিক', 'নেতা', 'কর্মী', 'সমর্থক', 'দল'
  ]

  const hasViolence = violenceKeywords.some(keyword => text.includes(keyword))
  const hasPolitics = politicalKeywords.some(keyword => text.includes(keyword))
  
  const isViolentPolitical = hasViolence && hasPolitics

  // Extract numbers for casualties
  const numbers = content.match(/\d+/g) || []
  const casualties = {
    injured: numbers.length > 0 ? parseInt(numbers[0]!) : 0,
    killed: numbers.length > 1 ? parseInt(numbers[1]!) : 0
  }

  // Determine severity based on keywords
  let severity: 'light' | 'medium' | 'heavy' | 'severe' = 'light'
  if (text.includes('নিহত') || text.includes('হত্যা') || text.includes('গুলি')) {
    severity = 'severe'
  } else if (text.includes('আহত') || text.includes('হামলা') || text.includes('আক্রমণ')) {
    severity = 'heavy'
  } else if (text.includes('মারামারি') || text.includes('সংঘর্ষ')) {
    severity = 'medium'
  }

  // Extract political party
  let politicalParty = 'অজানা'
  if (text.includes('আওয়ামী লীগ')) politicalParty = 'আওয়ামী লীগ'
  else if (text.includes('বিএনপি')) politicalParty = 'বিএনপি'
  else if (text.includes('জামায়াত')) politicalParty = 'জামায়াতে ইসলামী'
  else if (text.includes('জাতীয় পার্টি')) politicalParty = 'জাতীয় পার্টি'

  return {
    isViolentPolitical,
    location: 'অজানা',
    casualties,
    politicalParty,
    perpetratorRole: 'unclear',
    severity,
    description: title.substring(0, 100),
    images: [],
    confidence: 0.6
  }
}
