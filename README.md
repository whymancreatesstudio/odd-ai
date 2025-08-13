# ODD AI Tool

A comprehensive tool for managing company information with dynamic industry learning and social media management.

## Project Structure

```
oddtool/
├── frontend/          # React frontend application
│   ├── src/          # React components and logic
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── vite.config.js # Build configuration
├── backend/           # Backend files and documentation
│   └── README.md     # Backend setup guide
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Features

- **Company Management**: Comprehensive company details form
- **Dynamic Industries**: Smart learning system for new industries
- **Social Media**: Standard platforms + unlimited custom additions
- **Supabase Integration**: Real-time database backend
- **Responsive Design**: Modern UI with Tailwind CSS

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/whymancreatesstudio/odd-ai.git
   cd odd-ai
   ```

2. **Set up frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Add your Supabase credentials to .env
   npm run dev
   ```

3. **Set up database**
   - Create Supabase project
   - Run database migrations
   - Configure environment variables

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Database**: Real-time with Row Level Security

## Contributing

- `main` branch: Production-ready code
- `dev` branch: Development and testing

## License

[Add your license here]
