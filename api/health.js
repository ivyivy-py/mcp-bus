/**
 * Health check endpoint for Singapore Civic Transit API.
 * Supports Vercel Serverless Functions and Express route handlers.
 */
export default async function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim().length > 0);

  const payload = {
    status: 'ok',
    service: 'singapore-civic-transit-api',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    ltaDataMall: {
      hasAccountKey: hasLtaKey,
      note: hasLtaKey
        ? 'LTA_ACCOUNT_KEY is configured.'
        : 'LTA_ACCOUNT_KEY is missing or empty. Set LTA_ACCOUNT_KEY in environment variables.',
      upstreamEndpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    },
    endpoints: {
      health: '/api/health',
      busArrival: '/api/bus-arrival?BusStopCode=04121[&ServiceNo=147]',
    },
  };

  return res.status(200).json(payload);
}
