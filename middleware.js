import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static assets and train page
  if (pathname === '/train' || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const ip = req.ip ||
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0';

  const userAgent = req.headers.get('user-agent') || 'Unknown';

  try {
    const response = await fetch('https://bad-defender-production.up.railway.app/api/detect_bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, user_agent: userAgent })
    });

    if (!response.ok) {
      console.error(`Bot detection API error: ${response.status}`);
      return redirectToTrain(req);
    }

    const data = await response.json();
    const flags = data.details || {};
    
    const suspiciousFlags = {
      "Bot UA": flags.isBotUserAgent,
      "Scraper ISP": flags.isScraperISP,
      "IP Abuse": flags.isIPAbuser,
      "Traffic Spike": flags.isSuspiciousTraffic,
      "Data Center ASN": flags.isDataCenterASN
    };

    const triggeredReasons = Object.entries(suspiciousFlags)
      .filter(([_, val]) => val)
      .map(([key]) => key);

    if (triggeredReasons.length > 0) {
      await sendDiscordAlert(ip, userAgent, triggeredReasons, flags);
      return redirectToTrain(req);
    }

  } catch (error) {
    console.error('Bot detection middleware error:', error);
    return redirectToTrain(req);
  }

  return NextResponse.next();
}

function redirectToTrain(req) {
  const trainUrl = req.nextUrl.clone();
  trainUrl.pathname = '/train';
  return NextResponse.redirect(trainUrl);
}

async function sendDiscordAlert(ip, userAgent, reasons, flags) {
  const embed = {
    title: "🚫 Bot Blocked",
    color: 15158332,
    timestamp: new Date().toISOString(),
    fields: [
      { name: "🔍 IP Address", value: `\`${ip}\``, inline: true },
      { name: "🏢 ISP", value: flags?.isp || 'Unknown', inline: true },
      { name: "🏷️ ASN", value: `\`${flags?.asn || 'Unknown'}\``, inline: true },
      { name: "🧠 Reason(s)", value: reasons.join(', '), inline: false },
      { name: "🕵️‍♂️ User-Agent", value: `\`\`\`${userAgent.substring(0, 1000)}\`\`\``, inline: false }
    ],
    footer: { text: "Bot Detection System" }
  };

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: "Bot Blocker", embeds: [embed] }),
    });
  } catch (discordError) {
    console.error('Discord webhook alert failed:', discordError.message);
  }
}

export const config = {
  matcher: ['/((?!train|_next|favicon.ico).*)'],
};