import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: {
        date: 'desc'
      }
    })

    // Parse the images JSON string for each incident
    const parsedIncidents = incidents.map(incident => ({
      ...incident,
      images: JSON.parse(incident.images || '[]')
    }))

    return NextResponse.json({
      success: true,
      incidents: parsedIncidents
    })
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const incident = await prisma.incident.create({
      data: {
        title: body.title,
        location: body.location,
        latitude: body.coordinates[0],
        longitude: body.coordinates[1],
        injured: body.casualties.injured,
        killed: body.casualties.killed,
        politicalParty: body.politicalParty,
        date: new Date(body.date),
        severity: body.severity,
        description: body.description,
        sourceUrl: body.sourceUrl,
        images: body.images
      }
    })

    return NextResponse.json({
      success: true,
      incident: incident
    })
  } catch (error) {
    console.error('Error creating incident:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create incident' },
      { status: 500 }
    )
  }
}
