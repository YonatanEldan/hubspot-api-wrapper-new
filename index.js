require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { searchCompaniesByName, getCompanyActivityById } = require('./hubspot');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/search-companies', async (req, res) => {
  const { companyName } = req.body;
  if (!companyName) {
    return res.status(400).json({ error: 'Missing companyName in request body' });
  }
  try {
    const companies = await searchCompaniesByName(companyName);
    res.json(companies.map(c => ({
      id: c.id,
      name: c.properties.name,
      domain: c.properties.domain || null
    })));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.post('/company-activity', async (req, res) => {
  const { companyId } = req.body;
  if (!companyId) {
    return res.status(400).json({ error: 'Missing companyId in request body' });
  }
  try {
    const activity = await getCompanyActivityById(companyId);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 