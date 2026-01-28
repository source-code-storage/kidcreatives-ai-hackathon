# Technical Architecture

## Technology Stack

### Frontend
- **React 18+**: Core UI framework with hooks and context
- **ShadCN UI**: Component library for consistent, accessible design
- **Framer Motion**: Animation library for educational UI interactions
- **TailwindCSS**: Utility-first styling with custom "Constructivist Pop" theme
- **TypeScript**: Type safety for complex state management

### Backend & Services
- **Supabase**: 
  - Authentication (child/parent accounts)
  - PostgreSQL database (chat history, generations, trophy storage)
  - Real-time subscriptions for live updates
  - Storage for uploaded images and generated PDFs

### AI Integration
- **Google Gemini 2.5 Flash**: 
  - Vision API for image analysis (Phase 1)
  - Text generation for Socratic questioning (Phase 2)
  - Image generation with structure guidance (Phase 3)
- **Gemini Nano Banana**: Localized inpainting for conversational editing (Phase 4)

### Development Tools (MCP Servers)
- **context7**: Up-to-date code documentation and API references
  - **IMPORTANT**: Always use Context7 MCP when working with libraries/frameworks
  - Auto-invoke for: React, TypeScript, Supabase, Gemini AI, Framer Motion, TailwindCSS
  - Provides version-specific documentation and code examples directly from source
  - Example: "Use Context7 to get latest Supabase auth patterns" or "Check Context7 for Gemini Vision API examples"
- **agent-browser**: Headless browser automation for AI agents
  - **INTEGRATED**: Vercel agent-browser MCP server for automated visual testing
  - Fast Rust CLI with Node.js fallback
  - Chromium-based browser automation for testing Phase transitions and UI interactions
  - Use for: Automated testing of Phase 1→2→3 workflows, animation verification, responsive design testing
  - Example: "Use agent-browser to test the complete Q&A flow" or "Verify code block animations in Phase 2"

### Build & Deployment
- **Vite**: Fast development server and optimized production builds
- **Vercel**: Hosting platform with edge functions
- **pnpm**: Fast, disk-efficient package manager

## Architecture Overview

### Component Structure
```
KidCreatives AI (React SPA)
├── Phase Components (5 distinct UI states)
│   ├── HandshakePhase (Upload + Intent + Vision Analysis)
│   ├── PromptBuilderPhase (Socratic Q&A + Visual State Machine)
│   ├── GenerationPhase (Synthesis + Image Generation)
│   ├── RefinementPhase (Conversational Editing + Inpainting)
│   └── TrophyPhase (Holo-Card + PDF Generation)
├── Core Systems
│   ├── StateManager (Prompt_State_JSON orchestration)
│   ├── GeminiClient (API wrapper with retry logic)
│   ├── SupabaseClient (Auth, DB, Storage)
│   └── AnimationEngine (Framer Motion choreography)
└── UI Components
    ├── Sparky (AI Coach Avatar with reactive states)
    ├── PromptEngine (Conveyor belt visualization)
    ├── HoloCard (3D-tilting trophy card)
    └── SmartSheet (PDF layout generator)
```

### Data Flow
1. **Phase 1**: Image Upload → Supabase Storage → Gemini Vision API → Trust-building response
2. **Phase 2**: User answers → `Prompt_State_JSON` update → Animated code block → Next question
3. **Phase 3**: JSON → Prompt synthesis → Gemini Image API (with structure guidance) → Side-by-side display
4. **Phase 4**: Edit request → Nano Banana inpainting → Localized update
5. **Phase 5**: Finalization → Trophy generation → PDF creation → Supabase storage

### State Management Strategy
- **React Context**: Global app state (current phase, user session)
- **Local State**: Component-specific UI state (animations, form inputs)
- **Supabase Real-time**: Persistent state sync (chat history, saved projects)
- **Prompt_State_JSON**: Core educational state object tracking all user decisions

## Development Environment

### Required Tools
- **Node.js**: v20+ (LTS)
- **pnpm**: v8+ (package manager)
- **Git**: Version control
- **Kiro CLI**: AI-assisted development with custom prompts

### Environment Variables
```bash
# Gemini API
VITE_GEMINI_API_KEY=your_gemini_key

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development
VITE_DEV_MODE=true
```

### Setup Instructions
```bash
# Install dependencies
pnpm install

# Initialize Supabase schema
pnpm run db:setup

# Start development server
pnpm dev

# Run with Kiro CLI
kiro-cli  # Use @prime to load project context
```

### MCP Server Configuration
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "your_key"
      }
    },
    "vercel-agent-browser": {
      "command": "npx",
      "args": ["vercel-agent-browser"]
    }
  }
}
```

## Code Standards

### TypeScript Conventions
- **Strict mode enabled**: No implicit any, strict null checks
- **Interface naming**: PascalCase with descriptive names (e.g., `PromptStateJSON`, `GeminiVisionResponse`)
- **Component props**: Always define explicit prop interfaces
- **Enums for phases**: `enum Phase { Handshake, PromptBuilder, Generation, Refinement, Trophy }`

### React Best Practices
- **Functional components only**: Use hooks for state and side effects
- **Custom hooks**: Extract reusable logic (e.g., `useGeminiVision`, `usePromptState`)
- **Memoization**: Use `useMemo` and `useCallback` for expensive operations
- **Error boundaries**: Wrap each phase component for graceful failures

### File Naming
- **Components**: PascalCase (e.g., `HandshakePhase.tsx`, `PromptEngine.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGeminiVision.ts`)
- **Utils**: camelCase (e.g., `promptSynthesis.ts`, `pdfGenerator.ts`)
- **Types**: PascalCase in `types/` directory (e.g., `GeminiTypes.ts`)

### Styling
- **TailwindCSS utilities**: Prefer utility classes over custom CSS
- **Custom theme**: Define "Constructivist Pop" colors in `tailwind.config.js`
- **Color system**: Use semantic naming (e.g., `subject-blue`, `variable-purple`, `context-orange`)
- **Responsive design**: Mobile-first approach with tablet/desktop breakpoints

## Testing Strategy

### Unit Testing
- **Framework**: Vitest (Vite-native testing)
- **Coverage**: Focus on core logic (state management, prompt synthesis, API wrappers)
- **Mocking**: Mock Gemini API calls and Supabase interactions
- **Target**: 70%+ coverage for business logic

### Integration Testing
- **Framework**: React Testing Library
- **Focus**: Phase transitions, user interactions, animation triggers
- **Approach**: Test user workflows, not implementation details

### Visual Testing
- **Tool**: Vercel agent-browser MCP server
- **Focus**: UI consistency across phases, animation smoothness, responsive behavior
- **Manual**: Parent/child user testing for UX validation

### E2E Testing (Optional)
- **Framework**: Playwright (if time permits)
- **Critical paths**: Full 5-phase workflow completion

## Deployment Process

### CI/CD Pipeline (Vercel)
1. **Push to main**: Triggers automatic deployment
2. **Build**: `pnpm build` with type checking
3. **Preview**: Deploy to preview URL for testing
4. **Production**: Merge to production branch for live deployment

### Environment Strategy
- **Development**: Local with mock data and test API keys
- **Staging**: Vercel preview deployments with real APIs
- **Production**: Vercel production with rate limiting and monitoring

### Database Migrations
- **Tool**: Supabase CLI
- **Process**: Version-controlled SQL migrations in `supabase/migrations/`
- **Rollback**: Maintain rollback scripts for each migration

## Performance Requirements

### Load Times
- **Initial load**: < 2 seconds (critical for child engagement)
- **Phase transitions**: < 500ms (smooth, no jarring delays)
- **Image upload**: < 1 second for preview display
- **AI generation**: 3-5 seconds (with loading animation)

### Optimization Strategies
- **Code splitting**: Lazy load phase components
- **Image optimization**: Compress uploads, use WebP format
- **API caching**: Cache Gemini responses for identical prompts
- **Bundle size**: Keep initial bundle < 200KB gzipped

### Scalability
- **Concurrent users**: Support 100+ simultaneous sessions
- **Database**: Indexed queries for chat history and trophy retrieval
- **Storage**: CDN for generated images and PDFs

## Security Considerations

### Authentication
- **Supabase Auth**: Email/password for parent accounts
- **Child profiles**: Linked to parent accounts, no direct login
- **Session management**: Secure JWT tokens with refresh logic

### Data Protection
- **Image uploads**: Scan for inappropriate content (Gemini Vision moderation)
- **User data**: COPPA-compliant data handling for children
- **API keys**: Server-side only, never exposed to client
- **Rate limiting**: Prevent API abuse (10 generations per hour per user)

### Input Validation
- **Intent statements**: Sanitize text input, max 200 characters
- **Image uploads**: Validate file type (PNG, JPG), max 5MB
- **Prompt injection**: Filter malicious prompts before sending to Gemini

### Privacy
- **Data retention**: Clear policy for storing child-generated content
- **Parental controls**: Parents can delete all child data
- **Analytics**: Privacy-first analytics (no PII tracking)
