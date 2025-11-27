# Project Structure

This document provides a comprehensive overview of the folder and file structure of this project.

## Root Directory

```
.
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── bug_report.md               # Bug report template
├── CODE_OF_CONDUCT.md          # Code of conduct guidelines
├── components.json             # Components configuration
├── CONTRIBUTING.md             # Contribution guidelines
├── feature_request.md          # Feature request template
├── HALL-OF-FAME.md            # Hall of fame contributors
├── LICENSE                     # Project license
├── makefile                    # Make commands
├── middleware.ts               # Next.js middleware
├── next-sitemap.config.ts      # Sitemap configuration
├── next.config.mjs             # Next.js configuration
├── package.json                # NPM dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Project documentation
├── SECURITY.md                 # Security policy
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Directory Structure

### `/app` - Next.js App Directory
```
app/
├── (footer)/                   # Footer-related routes
│   ├── about/
│   ├── contact/
│   ├── cookie-consent/
│   ├── licensing/
│   ├── privacy-policy/
│   └── terms-of-service/
├── (main)/                     # Main application routes
│   ├── authentication/
│   ├── blogs/
│   ├── blogs/introduction
│   ├── home/
│   ├── leaderboard/
│   ├── problems/
│   ├── profile/
│   ├── resources/
│   ├── roles/
│   ├── unauthorized/
│   └── layout.tsx
├── api/                        # API routes
│   ├── admin/
│   ├── auth/
│   ├── badge/
│   ├── blogs/
│   ├── categories/
│   ├── chat/
│   ├── forgeacademy/
│   ├── leaderboard/
│   ├── problems/
│   ├── profile/
│   ├── resources/
│   ├── test/
│   └── user/
├── user/
│   └── [username]/             # Dynamic user profile routes
├── error.tsx                   # Error page
├── favicon.ico                 # Site favicon
├── globals.css                 # Global styles
├── layout.tsx                  # Root layout
├── loading.tsx                 # Loading state
├── not-found.tsx               # 404 page
└── page.tsx                    # Home page
```

### `/components` - React Components
```
components/
├── ui/                         # UI components
│   ├── accordion.tsx
│   ├── dropdown-menu.tsx
│   └── sheet.tsx
├── authError.tsx               # Authentication error component
├── AuthWrapper.tsx             # Authentication wrapper
├── CategoryButton.tsx          # Category button component
├── FilterSidebar.tsx           # Filter sidebar component
├── FloatingChat.tsx            # Floating chat component
├── Footer.tsx                  # Footer component
├── Hero.tsx                    # Hero section component
├── loading.tsx                 # Loading component
├── Navbar.tsx                  # Navigation bar component
├── QustionCards.tsx            # Question cards component
└── ResourceCard.tsx            # Resource card component
```

### `/context` - React Context
```
context/
└── ThemeContext.tsx            # Theme context provider
```

### `/interfaces` - TypeScript Interfaces
```
interfaces/
└── index.ts                    # Interface definitions
```

### `/lib` - Library Functions
```
lib/
├── authOptions.ts              # NextAuth configuration
├── tokenBlacklist.ts           # Token blacklist utilities
└── utils.ts                    # Utility functions
```

### `/middleware` - Middleware Functions
```
middleware/
├── adminToken.ts               # Admin token middleware
└── tokenBlacklist.ts           # Token blacklist middleware
```

### `/models` - Database Models
```
models/
├── AssignedBadge.ts            # Assigned badge model
├── badgeImage.ts               # Badge image model
├── badgeTemplate.ts            # Badge template model
├── badgeTemplateSchema.ts      # Badge template schema
├── qustionsSchema.ts           # Questions schema
├── Resource.ts                 # Resource model
├── tokenBlacklistSchema.ts     # Token blacklist schema
├── userQuestionSchema.ts       # User question schema
└── userSchema.ts               # User schema
```

### `/providers` - React Providers
```
providers/
└── auth-provider.tsx           # Authentication provider
```

### `/public` - Static Assets
```
public/
├── .well-known/
│   └── security.txt
├── badges/                     # Badge images
│   ├── custom/
│   ├── images/
│   ├── 0x1.png - 0x7.png
│   ├── bounty.svg
│   ├── bughunter.png
│   ├── CTF.svg
│   ├── event_organizer.svg
│   ├── member.svg
│   ├── president.svg
│   ├── researcher.svg
│   ├── secretary.svg
│   ├── securityresearcher.png
│   ├── Top.svg
│   ├── treasurer.svg
│   ├── vice-president.svg
│   └── Write-up.svg
├── 404.png
├── ads.txt
├── aichatbot.png
├── aichatbot2.png
├── doubt.png
├── flagforge-architecture.svg
├── flagforge-logo.png
├── flagforge.gif
├── logo.png
├── logo1.png
├── next.svg
├── NirmalDahal.jpeg
├── robots.txt
├── server-support-header-image.png
├── server-working.jpg
├── sitemap.xml
├── SobitThakuri.jpeg
└── vercel.svg
```

### `/types` - TypeScript Type Definitions
```
types/
├── assignBadge.ts              # Assign badge types
├── assignImage.ts              # Assign image types
├── badgeImage.ts               # Badge image types
└── next-auth.d.ts              # NextAuth type extensions
```

### `/utils` - Utility Functions
```
utils/
├── auth.ts                     # Authentication utilities
├── ctfDifficultyCalculator.ts  # CTF difficulty calculator
├── data.ts                     # Data utilities
├── db.ts                       # Database utilities
└── discordNotifier.ts          # Discord notification utilities
```

### `/.github` - GitHub Configuration
```
.github/
└── ISSUE_TEMPLATE/
    ├── bug_report.md
    └── feature_request.md
```

### `/.vscode` - VS Code Configuration
```
.vscode/
└── settings.json               # VS Code settings
```

## Technology Stack

Based on the project structure, this appears to be a:
- **Next.js** application (App Router)
- **TypeScript** project
- **Tailwind CSS** for styling
- **NextAuth** for authentication
- **MongoDB** database (inferred from schemas)
- **React** components with shadcn/ui

## Key Features

- User authentication and authorization
- Badge system with custom badges
- Blog functionality
- CTF problems and resources
- Leaderboard system
- User profiles
- Admin panel
- Discord integration
- AI chatbot integration
