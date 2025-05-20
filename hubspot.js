const axios = require('axios');

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const BASE_URL = 'https://api.hubapi.com';
const HEADERS = {
  Authorization: `Bearer ${HUBSPOT_API_KEY}`,
  'Content-Type': 'application/json',
};

function getDateNDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

async function searchCompaniesByName(companyName) {
  const url = `${BASE_URL}/crm/v3/objects/companies/search`;
  const body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'name',
            operator: 'EQ',
            value: companyName,
          },
        ],
      },
    ],
    properties: ['name', 'domain'],
    limit: 10,
  };
  const { data } = await axios.post(url, body, { headers: HEADERS });
  if (data.results && data.results.length > 0) {
    return data.results;
  }
  throw new Error('No companies found');
}

async function getEngagementDetails(engagementId) {
  const url = `${BASE_URL}/engagements/v1/engagements/${engagementId}`;
  const { data } = await axios.get(url, { headers: HEADERS });
  return data;
}

async function getEngagements(companyId, type) {
  const v1url = `${BASE_URL}/engagements/v1/engagements/associated/company/${companyId}/paged?limit=100`;
  const { data } = await axios.get(v1url, { headers: HEADERS });
  data.results.forEach(e => console.log('Engagement type:', e.engagement.type));
  const filtered = data.results.filter(e => e.engagement.type === type);
  const detailed = await Promise.all(filtered.map(e => getEngagementDetails(e.engagement.id)));
  return detailed;
}

async function getCompanyActivityById(companyId) {
  const threeMonthsAgo = getDateNDaysAgo(90);
  const [emails, meetings, notes] = await Promise.all([
    getEngagements(companyId, 'EMAIL'),
    getEngagements(companyId, 'MEETING'),
    getEngagements(companyId, 'NOTE'),
  ]);
  function filterRecent(arr) {
    return arr.filter(e => new Date(e.engagement.timestamp) >= new Date(threeMonthsAgo));
  }
  return {
    emails: filterRecent(emails),
    meetings: filterRecent(meetings),
    notes: filterRecent(notes),
  };
}

module.exports = { getCompanyActivityById, searchCompaniesByName }; 