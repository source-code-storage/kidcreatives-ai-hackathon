# MCP Server Setup - context7

## What is context7?

context7 is an MCP server that provides up-to-date documentation for popular libraries and frameworks. It's perfect for getting the latest API references while coding.

## Installation Complete ✅

The context7 MCP server has been configured in `.kiro/settings/mcp.json`

## How to Use

### In Kiro CLI

Once the MCP server is running, you can access documentation for:

- **React** - Latest React 18 APIs
- **TypeScript** - Type system and compiler options
- **TailwindCSS** - Utility classes and configuration
- **Vite** - Build configuration and plugins
- **Supabase** - Client APIs and database queries
- **Google Gemini** - AI API methods and parameters
- **Framer Motion** - Animation APIs

### Example Queries

```bash
# In Kiro CLI, you can ask:
"How do I use Supabase storage to upload images?"
"What's the latest Gemini Vision API syntax?"
"Show me Framer Motion spring animation options"
"How do I configure TailwindCSS custom colors?"
```

The context7 server will automatically fetch the latest documentation to answer your questions.

## Verification

To verify the MCP server is working:

1. **Restart Kiro CLI** (if already running)
2. **Check MCP status**: Use `/mcp` command in Kiro CLI
3. **Test a query**: Ask about any of the supported libraries

## Configuration

The MCP server is configured to run via npx, so it will:
- ✅ Automatically download when first used
- ✅ Always use the latest version
- ✅ No manual installation required
- ✅ No API keys needed

## Supported Documentation

context7 provides documentation for:
- React & React DOM
- TypeScript
- Node.js
- Vite
- TailwindCSS
- Supabase
- Google AI (Gemini)
- Framer Motion
- And many more...

## Benefits for KidCreatives AI

1. **Latest Gemini API docs** - Get current syntax for Vision and Image generation
2. **Supabase references** - Up-to-date auth, storage, and database APIs
3. **React patterns** - Modern hooks and component patterns
4. **Framer Motion** - Animation API references
5. **TypeScript help** - Type definitions and best practices

## Troubleshooting

### If MCP server doesn't start:
```bash
# Test npx access
npx -y @upstash/context7-mcp --version

# Check Node.js version (should be 18+)
node --version
```

### If documentation seems outdated:
The server fetches live documentation, so it should always be current. If you notice issues, restart Kiro CLI.

## Next Steps

1. **Restart Kiro CLI** to load the MCP configuration
2. **Use `/mcp`** to verify the server is running
3. **Start asking questions** about your tech stack
4. **Build faster** with instant access to documentation

---

**Status**: ✅ context7 MCP server configured and ready to use!
