import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  const { startDate, endDate } = req.query;

  const response = await fetch(`https://api.vercel.com/v1/insights/${process.env.VERCEL_PROJECT_ID}/events?start=${startDate}&end=${endDate}`, {
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
    },
  });

  const data = await response.json();

  // Process and format the data as needed
  const dailyData = data.events.reduce((acc, event) => {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date]++;
    return acc;
  }, {});

  const formattedData = Object.entries(dailyData).map(([date, count]) => ({ date, count }));

  res.status(200).json(formattedData);
}