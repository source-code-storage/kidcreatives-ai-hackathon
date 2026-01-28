# Project Structure

## Directory Layout

```
kidcreatives-ai/
├── src/
│   ├── components/
│   │   ├── phases/
│   │   │   ├── HandshakePhase.tsx
│   │   │   ├── PromptBuilderPhase.tsx
│   │   │   ├── GenerationPhase.tsx
│   │   │   ├── RefinementPhase.tsx
│   │   │   └── TrophyPhase.tsx
│   │   ├── ui/
│   │   │   ├── Sparky.tsx              # AI coach avatar
│   │   │   ├── PromptEngine.tsx        # Conveyor belt visualization
│   │   │   ├── HoloCard.tsx            # 3D trophy card
│   │   │   ├── SmartSheet.tsx          # PDF generator
│   │   │   └── shadcn/                 # ShadCN UI components
│   │   └── shared/
│   │       ├── ImageUpload.tsx
│   │       ├── ChatBubble.tsx
│   │       └── LoadingAnimation.tsx
│   ├── lib/
│   │   ├── gemini/
│   │   │   ├── visionClient.ts         # Gemini Vision API wrapper
│   │   │   ├── imageClient.ts          # Gemini Image generation
│   │   │   └── nanoBanana.ts           # Nano Banana inpainting
│   │   ├── supabase/
│   │   │   ├── client.ts               # Supabase client setup
│   │   │   ├── auth.ts                 # Authentication logic
│   │   │   ├── storage.ts              # Image/PDF storage
│   │   │   └── database.ts             # DB queries
│   │   ├── state/
│   │   │   ├── PromptStateManager.ts   # Prompt_State_JSON orchestration
│   │   │   └── PhaseManager.ts         # Phase transition logic
│   │   └── utils/
│   │       ├── promptSynthesis.ts      # JSON → narrative prompt
│   │       ├── pdfGenerator.ts         # Smart Sheet PDF creation
│   │       └── imageProcessing.ts      # Image optimization
│   ├── hooks/
│   │   ├── useGeminiVision.ts
│   │   ├── usePromptState.ts
│   │   ├── usePhaseTransition.ts
│   │   └── useSupabaseAuth.ts
│   ├── types/
│   │   ├── GeminiTypes.ts
│   │   ├── PromptState.ts
│   │   ├── PhaseTypes.ts
│   │   └── SupabaseTypes.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css              # Framer Motion presets
│   ├── contexts/
│   │   ├── AppContext.tsx              # Global app state
│   │   └── AuthContext.tsx             # User session
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_chat_history.sql
│   │   └── 003_trophy_storage.sql
│   └── config.toml
├── public/
│   ├── sparky-assets/                  # Sparky avatar states
│   └── fonts/                          # Monospace fonts for code blocks
├── tests/
│   ├── unit/
│   │   ├── promptSynthesis.test.ts
│   │   └── stateManager.test.ts
│   ├── integration/
│   │   └── phaseTransitions.test.tsx
│   └── e2e/
│       └── fullWorkflow.spec.ts
├── .kiro/
│   ├── steering/
│   │   ├── product.md
│   │   ├── tech.md
│   │   ├── structure.md
│   │   └── testing-standards.md
│   ├── prompts/
│   │   ├── prime.md
│   │   ├── plan-feature.md
│   │   └── code-review.md
│   └── settings/
│       └── mcp.json
├── tailwind.config.js                  # Constructivist Pop theme
├── vite.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── .env.example
├── .gitignore
├── README.md
└── DEVLOG.md
```

## File Naming Conventions

### Components
- **React Components**: PascalCase (e.g., `HandshakePhase.tsx`, `PromptEngine.tsx`)
- **UI Components**: PascalCase in `ui/` directory (e.g., `Sparky.tsx`, `HoloCard.tsx`)
- **Shared Components**: PascalCase in `shared/` directory

### Logic & Utilities
- **Hooks**: camelCase with `use` prefix (e.g., `useGeminiVision.ts`, `usePromptState.ts`)
- **Utilities**: camelCase (e.g., `promptSynthesis.ts`, `pdfGenerator.ts`)
- **API Clients**: camelCase with descriptive suffix (e.g., `visionClient.ts`, `imageClient.ts`)

### Types & Interfaces
- **Type Files**: PascalCase (e.g., `GeminiTypes.ts`, `PromptState.ts`)
- **Interfaces**: PascalCase with descriptive names (e.g., `PromptStateJSON`, `GeminiVisionResponse`)
- **Enums**: PascalCase (e.g., `Phase`, `PromptVariable`)

### Styles
- **CSS Files**: kebab-case (e.g., `globals.css`, `animations.css`)
- **Tailwind Config**: Standard `tailwind.config.js`

## Module Organization

### Phase Components (`src/components/phases/`)
Each phase is a self-contained component with its own logic:
- **HandshakePhase**: Image upload, intent input, vision analysis
- **PromptBuilderPhase**: Socratic Q&A, animated code blocks
- **GenerationPhase**: Prompt synthesis, image generation
- **RefinementPhase**: Conversational editing, inpainting
- **TrophyPhase**: Holo-card display, PDF generation

### Core Systems (`src/lib/`)
Business logic separated from UI:
- **gemini/**: All Gemini API interactions
- **supabase/**: Database, auth, storage operations
- **state/**: State management and orchestration
- **utils/**: Pure functions for data transformation

### UI Components (`src/components/ui/`)
Reusable UI elements:
- **Sparky**: AI coach with reactive states
- **PromptEngine**: Visual prompt construction
- **HoloCard**: 3D trophy card with tilt effect
- **SmartSheet**: PDF layout generator
- **shadcn/**: ShadCN UI component library

## Configuration Files

### Root Level
- **vite.config.ts**: Vite build configuration, plugins, aliases
- **tsconfig.json**: TypeScript compiler options (strict mode enabled)
- **tailwind.config.js**: Custom "Constructivist Pop" theme colors
- **package.json**: Dependencies, scripts, project metadata
- **.env.example**: Template for environment variables

### Supabase
- **supabase/config.toml**: Supabase project configuration
- **supabase/migrations/**: Version-controlled SQL migrations

### Kiro CLI
- **.kiro/steering/**: Project context documents
  - **product.md**: Product overview, target users, 5-phase workflow, success criteria
  - **tech.md**: Technology stack, architecture, MCP servers, development tools
  - **structure.md**: Directory layout, file naming conventions, module organization
  - **testing-standards.md**: Testing philosophy, agent-browser usage, test scenarios
- **.kiro/prompts/**: Custom development prompts
- **.kiro/settings/mcp.json**: MCP server configuration

## Documentation Structure

### Root Documentation
- **README.md**: Project overview, setup instructions, usage guide
- **DEVLOG.md**: Development timeline, decisions, challenges, time tracking

### Code Documentation
- **Inline Comments**: JSDoc for functions, complex logic explanations
- **Type Definitions**: Self-documenting interfaces and types
- **Component Props**: Explicit prop interfaces with descriptions

### API Documentation
- **Gemini Integration**: Document API endpoints, parameters, responses
- **Supabase Schema**: Document database tables, relationships, queries

## Asset Organization

### Public Assets (`public/`)
- **sparky-assets/**: Sparky avatar states (waiting, thinking, success)
- **fonts/**: Monospace fonts for code blocks (JetBrains Mono, Courier)
- **icons/**: App icons and favicons

### Generated Assets (Runtime)
- **Uploaded Images**: Stored in Supabase Storage (`user-uploads/`)
- **Generated Images**: Stored in Supabase Storage (`ai-generations/`)
- **PDFs**: Generated on-demand, stored in Supabase Storage (`certificates/`)

## Build Artifacts

### Development
- **node_modules/**: Dependencies (gitignored)
- **dist/**: Vite build output (gitignored)
- **.vite/**: Vite cache (gitignored)

### Production
- **dist/**: Optimized production build
  - Code splitting by phase components
  - Minified JS/CSS
  - Optimized assets

## Environment-Specific Files

### Development
- **.env.local**: Local development environment variables
- **VITE_DEV_MODE=true**: Enable development features

### Staging
- **.env.staging**: Staging environment variables
- Vercel preview deployments with real APIs

### Production
- **.env.production**: Production environment variables
- Rate limiting and monitoring enabled
- COPPA-compliant data handling

### Environment Variables
```bash
# Gemini API
VITE_GEMINI_API_KEY=your_gemini_key

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development
VITE_DEV_MODE=true

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_RATE_LIMITING=true
```

## Design System Organization

### Tailwind Theme (`tailwind.config.js`)
```javascript
// Constructivist Pop Color System
colors: {
  'subject-blue': '#4A90E2',      // Subjects (Robot, Cat, Monster)
  'variable-purple': '#9B59B6',   // Variables (Texture, Material, Style)
  'context-orange': '#E67E22',    // Context (Lighting, Background, Era)
  'action-green': '#27AE60',      // Action buttons (Go, Print)
  'system-grey': '#95A5A6',       // System (Sparky's dialogue)
}
```

### Animation Presets (`src/styles/animations.css`)
- **Code Block Entry**: Scale 0 → 1 with spring bounce
- **Conveyor Belt**: Horizontal slide with physics
- **Sparky States**: Blinking, thinking gears, success animation
- **Holo-Card Tilt**: Mouse/device tilt effect

## Version Control Strategy

### Gitignore
- **Dependencies**: `node_modules/`, `pnpm-lock.yaml` (tracked)
- **Build Artifacts**: `dist/`, `.vite/`
- **Environment**: `.env.local`, `.env.production`
- **IDE**: `.vscode/`, `.idea/`
- **OS**: `.DS_Store`, `Thumbs.db`

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature branches
- **hotfix/***: Emergency production fixes
