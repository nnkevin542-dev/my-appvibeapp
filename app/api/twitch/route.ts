import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Получаем язык из запроса (по умолчанию ru)
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || 'ru';

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Twitch keys are missing' }, { status: 500 });
  }

  try {
    // 1. Получаем специальный серверный токен доступа от Twitch
    const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
      method: 'POST',
      cache: 'no-store'
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Запрашиваем топ-50 живых стримеров у Twitch (только онлайн!)
    const streamsRes = await fetch(`https://api.twitch.tv/helix/streams?language=${language}&first=50`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store' // Отключаем кэш, чтобы данные всегда были свежими
    });
    const streamsData = await streamsRes.json();

    return NextResponse.json(streamsData.data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from Twitch' }, { status: 500 });
  }
}