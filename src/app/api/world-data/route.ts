import { loadWorldRooms, loadWorldChecks } from '@/logic/data/loadRooms';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rooms = loadWorldRooms();
    const checks = loadWorldChecks();

    return NextResponse.json({ rooms, checks });
  } catch (error) {
    console.error('Error loading world data:', error);
    return NextResponse.json({ error: 'Failed to load world data' }, { status: 500 });
  }
}
