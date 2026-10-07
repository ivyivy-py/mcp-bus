/**
 * LTA DataMall v3 Bus Arrival API Proxy
 * GET /api/bus-arrival?BusStopCode=04121[&ServiceNo=7]
 *
 * Upstream:
 * GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
 * Header: AccountKey: process.env.LTA_ACCOUNT_KEY
 */

const LTA_API_BASE = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';

// Preset fallback data for common stops to ensure high-availability if key is not yet added
const FALLBACK_SERVICES_BY_STOP = {
  '04121': [
    {
      ServiceNo: '147',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '64109',
        DestinationCode: '28009',
        EstimatedArrival: getFutureIso(110),
        Latitude: '1.2917',
        Longitude: '103.8494',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '64109',
        DestinationCode: '28009',
        EstimatedArrival: getFutureIso(480),
        Latitude: '1.2990',
        Longitude: '103.8520',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        OriginCode: '64109',
        DestinationCode: '28009',
        EstimatedArrival: getFutureIso(920),
        Latitude: '1.3120',
        Longitude: '103.8560',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
    },
    {
      ServiceNo: '190',
      Operator: 'SMRT',
      NextBus: {
        OriginCode: '44009',
        DestinationCode: '10049',
        EstimatedArrival: getFutureIso(280),
        Latitude: '1.2930',
        Longitude: '103.8480',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '44009',
        DestinationCode: '10049',
        EstimatedArrival: getFutureIso(620),
        Latitude: '1.3050',
        Longitude: '103.8320',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        OriginCode: '44009',
        DestinationCode: '10049',
        EstimatedArrival: getFutureIso(1050),
        Latitude: '1.3200',
        Longitude: '103.8150',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
    },
    {
      ServiceNo: '12',
      Operator: 'GAS',
      NextBus: {
        OriginCode: '77009',
        DestinationCode: '10049',
        EstimatedArrival: getFutureIso(420),
        Latitude: '1.2960',
        Longitude: '103.8500',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '77009',
        DestinationCode: '10049',
        EstimatedArrival: getFutureIso(890),
        Latitude: '1.3040',
        Longitude: '103.8610',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: null,
    },
  ],
  '08057': [
    {
      ServiceNo: '65',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '76191',
        DestinationCode: '10018',
        EstimatedArrival: getFutureIso(65),
        Latitude: '1.2995',
        Longitude: '103.8450',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '76191',
        DestinationCode: '10018',
        EstimatedArrival: getFutureIso(410),
        Latitude: '1.3060',
        Longitude: '103.8530',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        OriginCode: '76191',
        DestinationCode: '10018',
        EstimatedArrival: getFutureIso(830),
        Latitude: '1.3210',
        Longitude: '103.8710',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'SD',
      },
    },
    {
      ServiceNo: '190',
      Operator: 'SMRT',
      NextBus: {
        OriginCode: '44009',
        DestinationCode: '10049',
        EstimatedArrival: getFutureIso(190),
        Latitude: '1.3020',
        Longitude: '103.8410',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '44009',
        DestinationCode: '10049',
        EstimatedArrival: getFutureIso(540),
        Latitude: '1.3080',
        Longitude: '103.8310',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: null,
    },
    {
      ServiceNo: '7',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '84049',
        DestinationCode: '17009',
        EstimatedArrival: getFutureIso(310),
        Latitude: '1.3000',
        Longitude: '103.8490',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '84049',
        DestinationCode: '17009',
        EstimatedArrival: getFutureIso(750),
        Latitude: '1.3090',
        Longitude: '103.8620',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus3: null,
    },
    {
      ServiceNo: '36',
      Operator: 'GAS',
      NextBus: {
        OriginCode: '95029',
        DestinationCode: '09191',
        EstimatedArrival: getFutureIso(560),
        Latitude: '1.2980',
        Longitude: '103.8560',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus2: null,
      NextBus3: null,
    },
  ],
};

function getFutureIso(seconds) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract query parameters (supporting both capitalized and lowercase)
  const query = req.query || {};
  const busStopCode = (query.BusStopCode || query.busStopCode || query.busstopcode || '04121').toString().trim();
  const serviceNo = (query.ServiceNo || query.serviceNo || query.serviceno || '').toString().trim();

  if (!busStopCode) {
    return res.status(400).json({
      error: 'BusStopCode is required. Example: /api/bus-arrival?BusStopCode=04121',
    });
  }

  const accountKey = (
    process.env.LTA_ACCOUNT_KEY ||
    req.headers['accountkey'] ||
    req.headers['AccountKey'] ||
    ''
  ).toString().trim();

  // If LTA_ACCOUNT_KEY is configured, call LTA DataMall v3 API
  if (accountKey) {
    try {
      const upstreamUrl = new URL(LTA_API_BASE);
      upstreamUrl.searchParams.set('BusStopCode', busStopCode);
      if (serviceNo) {
        upstreamUrl.searchParams.set('ServiceNo', serviceNo);
      }

      const ltaResponse = await fetch(upstreamUrl.toString(), {
        method: 'GET',
        headers: {
          AccountKey: accountKey,
          accept: 'application/json',
        },
      });

      if (!ltaResponse.ok) {
        const errText = await ltaResponse.text();
        console.error(`LTA DataMall error ${ltaResponse.status}:`, errText);
        // If upstream error, provide status and fallback
        return res.status(ltaResponse.status).json({
          error: `LTA DataMall returned HTTP ${ltaResponse.status}`,
          details: errText,
          fallbackData: getFallbackData(busStopCode, serviceNo),
        });
      }

      const ltaData = await ltaResponse.json();

      // Cache for 15 seconds since LTA arrival feed refreshes every 20 seconds
      res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=5');
      return res.status(200).json({
        ...ltaData,
        isLive: true,
        fetchedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to contact LTA DataMall:', err);
      return res.status(502).json({
        error: 'Failed to contact LTA DataMall upstream service',
        message: err.message,
        fallbackData: getFallbackData(busStopCode, serviceNo),
      });
    }
  }

  // If LTA_ACCOUNT_KEY is not yet set in environment variables
  const simulatedData = getFallbackData(busStopCode, serviceNo);
  res.setHeader('Cache-Control', 'no-cache');
  return res.status(200).json({
    ...simulatedData,
    isLive: false,
    notice: 'LTA_ACCOUNT_KEY environment variable is not configured yet. Returning simulated LTA v3 data. Add LTA_ACCOUNT_KEY in Vercel to receive live GPS telemetry.',
    fetchedAt: new Date().toISOString(),
  });
}

function getFallbackData(busStopCode, serviceNo) {
  let services = FALLBACK_SERVICES_BY_STOP[busStopCode];

  if (!services) {
    // Generate standard simulated response for any stop
    services = [
      {
        ServiceNo: serviceNo || '65',
        Operator: 'SBST',
        NextBus: {
          OriginCode: '76191',
          DestinationCode: '10018',
          EstimatedArrival: getFutureIso(120),
          Latitude: '1.2950',
          Longitude: '103.8500',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'DD',
        },
        NextBus2: {
          OriginCode: '76191',
          DestinationCode: '10018',
          EstimatedArrival: getFutureIso(580),
          Latitude: '1.3050',
          Longitude: '103.8600',
          VisitNumber: '1',
          Load: 'SDA',
          Feature: 'WAB',
          Type: 'DD',
        },
        NextBus3: {
          OriginCode: '76191',
          DestinationCode: '10018',
          EstimatedArrival: getFutureIso(1040),
          Latitude: '1.3200',
          Longitude: '103.8750',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'SD',
        },
      },
      {
        ServiceNo: '147',
        Operator: 'SBST',
        NextBus: {
          OriginCode: '64109',
          DestinationCode: '28009',
          EstimatedArrival: getFutureIso(240),
          Latitude: '1.2890',
          Longitude: '103.8450',
          VisitNumber: '1',
          Load: 'SDA',
          Feature: 'WAB',
          Type: 'DD',
        },
        NextBus2: {
          OriginCode: '64109',
          DestinationCode: '28009',
          EstimatedArrival: getFutureIso(720),
          Latitude: '1.2800',
          Longitude: '103.8350',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'SD',
        },
        NextBus3: null,
      },
    ];
  }

  if (serviceNo) {
    services = services.filter((s) => s.ServiceNo.toLowerCase() === serviceNo.toLowerCase());
  }

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv3/@Element',
    BusStopCode: busStopCode,
    Services: services,
  };
}
