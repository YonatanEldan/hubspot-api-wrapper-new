node_modules/
.env 

# HubSpot API Wrapper: Recent Company Activity

## Overview
This Node.js Express API allows you to:
- Accept a company name
- Search for the company in HubSpot
- Retrieve emails, meetings, and notes associated with that company in the last 3 months
- Return the activity data as JSON

## Setup

1. Clone this repo or copy the files into your project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   HUBSPOT_API_KEY=your-hubspot-api-key-here
   ```
4. Start the server:
   ```bash
   node index.js
   ```

## API Usage

### POST `/search-companies`

**Request Body:**
```json
{
  "companyName": "Acme Inc"
}
```
**Response:**
```json
[
  { "id": "123", "name": "Acme Inc", "domain": "acme.com" },
  { "id": "456", "name": "Acme Ltd", "domain": "acme.co.uk" }
]
```

### POST `/company-activity`

**Request Body:**
```json
{
  "companyId": "123"
}
```
**Response:**
```json
{
  "emails": [ ... ],
  "meetings": [ ... ],
  "notes": [ ... ]
}
```

- Each array contains activity objects from the last 3 months.
- If the company is not found, you will receive a 500 error with a message.

## For Custom GPT Integration
- Deploy this API (e.g., on Render, Vercel, or your own server).
- Use the endpoints in your GPT's API calls.

## Notes
- Requires a HubSpot Private App API Key with CRM object and engagement read permissions.
- This project uses both v3 and legacy v1 HubSpot APIs due to engagement data limitations. 