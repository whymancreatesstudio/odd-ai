# ODD AI Tool

A comprehensive CRM tool that combines AI-generated insights with live Google Search data for enhanced business intelligence.

## 🏗️ Project Structure

```
oddtool/
├── backend/                 # Express.js backend with Google Search API
│   ├── server.js          # Main server with API endpoints
│   ├── googleSearch.js    # Google Custom Search API helper
│   ├── supabase.js        # Supabase client for database operations
│   ├── package.json       # Backend dependencies
│   └── .env               # Environment variables
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── CompanyForm.jsx # Company details form
│   │   ├── CRMInsights.jsx # AI-powered CRM insights
│   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   ├── api.js         # API integration with backend
│   │   ├── supabase.js    # Supabase client
│   │   └── main.jsx       # React entry point
│   └── package.json
│
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Google Cloud Project** with Custom Search API enabled
2. **Google Custom Search Engine** created
3. **Supabase Project** for database storage
4. **Node.js** (v16 or higher)

### 1. Google Cloud Setup

#### Create Google Cloud Project:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `odd-ai-crm-search`
3. Enable **Custom Search API**

#### Get API Credentials:
1. Go to "APIs & Services" → "Credentials"
2. Create API Key
3. Restrict to "Custom Search API" only

#### Create Custom Search Engine:
1. Visit [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Create search engine (search entire web)
3. Copy Search Engine ID

### 2. Environment Setup

#### Backend (.env):
```bash
cd backend
# Edit .env file with your actual credentials
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
NODE_ENV=development
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔍 API Endpoints

### Health Check
```
GET /api/health
```

### Search Endpoints
```
POST /api/search
POST /api/search/company
```

### Data Management
```
POST /api/save-results
GET /api/search-history/:companyName
POST /api/update-crm
```

## 📊 Search Types

The API supports specialized searches:

- **Funding**: Investment rounds, funding news
- **News**: Company announcements, press releases
- **Jobs**: Hiring status, open positions
- **People**: Leadership team, key personnel
- **Company**: Company profile, about us information

## 💰 Pricing

### Google Custom Search API:
- **Free Tier**: 100 searches/day
- **Paid**: $5 per 1,000 searches
- **Rate Limit**: 10,000 searches/day

### Supabase:
- **Free Tier**: 50,000 monthly active users
- **Paid**: $25/month for 100,000 users

## 🔒 Security Features

- API key restrictions
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment variable protection

## 🛠️ Development

### Backend Development:
```bash
cd backend
npm run dev          # Start with nodemon
npm start           # Start production server
```

### Frontend Development:
```bash
cd frontend
npm start           # Start React dev server
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Custom Search API key | ✅ |
| `GOOGLE_SEARCH_ENGINE_ID` | Custom search engine ID | ✅ |
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `PORT` | Server port (default: 5000) | ❌ |
| `NODE_ENV` | Environment (development/production) | ❌ |

## 🎯 Features

### Current:
- ✅ AI-powered CRM insights generation
- ✅ Google Custom Search API integration
- ✅ Express.js backend server
- ✅ React frontend with Tailwind CSS
- ✅ Supabase database integration
- ✅ Comprehensive search endpoints
- ✅ Search result storage and history
- ✅ Company form with AI generation
- ✅ CRM insights dashboard

### Enhanced with Google Search:
- 🔄 Live company research and validation
- 🔄 Real-time funding and news data
- 🔄 Current hiring status and job openings
- 🔄 Leadership team updates
- 🔄 Market intelligence and trends

## 🚀 What's New

### Google Search Integration:
- **Live Data**: Real-time web search for company information
- **Enhanced CRM**: Combine AI insights with live search results
- **Market Intelligence**: Industry trends and competitor analysis
- **Data Validation**: Cross-reference AI-generated data with live sources

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create new issue with detailed description

---

**Next Steps**: Set up your Google Cloud credentials and update the `backend/.env` file, then start both servers!
