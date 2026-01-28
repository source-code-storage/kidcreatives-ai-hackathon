# Agent Browser Integration Guide

## Overview

Vercel agent-browser is now integrated as an MCP server for automated visual testing and browser automation during development.

## Installation Status

✅ **Installed**: agent-browser v0.8.4  
✅ **Chromium Downloaded**: Chrome for Testing 145.0.7632.6  
✅ **MCP Configured**: `.kiro/settings/mcp.json`

## Configuration

```json
{
  "mcpServers": {
    "agent-browser": {
      "command": "agent-browser",
      "args": ["mcp"],
      "env": {}
    }
  }
}
```

## Use Cases for KidCreatives AI

### 1. Phase Transition Testing
Test the complete workflow from Phase 1 → Phase 2:
```
Use agent-browser to:
1. Navigate to http://localhost:5173
2. Upload an image file
3. Enter intent statement "A robot doing a backflip in space"
4. Click "Let's Go!" button
5. Wait for Sparky's response
6. Click "Continue to Prompt Builder"
7. Verify Phase 2 loads with progress bar
```

### 2. Socratic Q&A Flow Testing
Test the complete 4-question workflow:
```
Use agent-browser to:
1. Start from Phase 2
2. Answer question 1 with "Smooth and shiny like metal"
3. Click "Submit Answer"
4. Verify code block animates into Prompt Engine
5. Verify progress bar updates to "Question 2 of 4"
6. Repeat for all 4 questions
7. Verify completion screen appears
```

### 3. Animation Verification
Test Framer Motion animations:
```
Use agent-browser to:
1. Navigate to Phase 2
2. Submit an answer
3. Take screenshot before animation
4. Wait 1 second
5. Take screenshot after animation
6. Verify code block appeared in Prompt Engine
```

### 4. Responsive Design Testing
Test mobile and tablet layouts:
```
Use agent-browser to:
1. Set viewport to 375x667 (iPhone)
2. Navigate through Phase 1 and Phase 2
3. Verify layout adapts correctly
4. Set viewport to 768x1024 (iPad)
5. Verify tablet layout
```

### 5. Error Handling Testing
Test error states:
```
Use agent-browser to:
1. Navigate to Phase 1
2. Try to submit without image (verify button disabled)
3. Try to submit without intent (verify button disabled)
4. Disconnect network
5. Try to analyze (verify error message appears)
```

## Example Commands

### Basic Navigation
```bash
# Via Kiro CLI (MCP integrated)
"Use agent-browser to navigate to http://localhost:5173 and take a screenshot"
```

### Form Interaction
```bash
# Via Kiro CLI
"Use agent-browser to fill the textarea with 'A robot in space' and click the submit button"
```

### Wait for Elements
```bash
# Via Kiro CLI
"Use agent-browser to wait for the element with text 'Sparky says:' to appear"
```

## Development Workflow

### Before Committing Code
1. Start dev server: `cd kidcreatives-ai && npm run dev`
2. Use agent-browser via Kiro CLI to test critical paths
3. Verify all animations work
4. Check responsive layouts
5. Test error states

### Automated Testing Script (Future)
Create a test script that uses agent-browser to:
- Test Phase 1 → Phase 2 transition
- Test all 4 questions in Phase 2
- Verify code blocks appear
- Check completion screen
- Test back navigation

## Troubleshooting

### "Shared Library" Errors
If you see shared library errors when running:
```bash
agent-browser install --with-deps
# or
npx playwright install-deps chromium
```

### Browser Not Found
If Chromium is not found:
```bash
agent-browser install
```

### MCP Server Not Responding
Restart Kiro CLI to reload MCP servers:
```bash
# Exit and restart kiro-cli
```

## Benefits

1. **Automated Visual Testing**: Test UI without manual clicking
2. **Regression Prevention**: Catch visual bugs before they reach production
3. **Animation Verification**: Ensure Framer Motion animations work correctly
4. **Cross-Device Testing**: Test responsive layouts programmatically
5. **CI/CD Integration**: Can be integrated into automated pipelines (future)

## Next Steps

1. ✅ Installation complete
2. ✅ MCP configuration added
3. ✅ Documentation created
4. ⏳ Test Phase 1 → Phase 2 workflow with agent-browser
5. ⏳ Create automated test scripts
6. ⏳ Integrate into CI/CD pipeline (future)

---

**Last Updated**: January 28, 2026  
**Agent Browser Version**: 0.8.4  
**Status**: ✅ Ready for use
