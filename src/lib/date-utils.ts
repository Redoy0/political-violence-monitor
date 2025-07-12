// Utility functions for safe date formatting to prevent hydration errors

export function formatDateSafe(dateString: string): string {
  try {
    const date = new Date(dateString)
    
    // Use a consistent format that doesn't depend on locale
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid Date'
  }
}

export function formatDateBengali(dateString: string): string {
  try {
    const date = new Date(dateString)
    
    const bengaliMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ]
    
    const day = date.getDate()
    const month = bengaliMonths[date.getMonth()]
    const year = date.getFullYear()
    
    return `${day} ${month}, ${year}`
  } catch (error) {
    console.error('Bengali date formatting error:', error)
    return 'তারিখ নেই'
  }
}
