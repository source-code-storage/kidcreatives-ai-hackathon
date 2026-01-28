# Testing Standards

## Testing Philosophy

KidCreatives AI prioritizes **user experience validation** over unit test coverage. Given the educational nature and visual/interactive focus, testing emphasizes:

1. **Visual correctness** - Animations, layouts, phase transitions
2. **User workflows** - Complete 5-phase journey testing
3. **AI integration** - Gemini API responses and error handling
4. **Child-friendly UX** - Age-appropriate interactions and feedback

## Testing Tools

### Primary: Vercel agent-browser
**Purpose**: Automated visual and interaction testing  
**Installation**: `npm install -g agent-browser` (already installed v0.8.4)  
**Documentation**: https://github.com/vercel-labs/agent-browser

**Why agent-browser?**
- Fast Rust CLI with Node.js fallback
- Chromium-based browser automation
- Accessibility tree snapshots with refs
- Perfect for testing React animations and phase transitions
- Integrated with Kiro CLI via MCP server

### Secondary: Manual Testing
**Purpose**: UX validation with target age group  
**Approach**: Parent/child user testing sessions

### Future: Vitest + React Testing Library
**Purpose**: Unit tests for business logic  
**Status**: Planned for post-hackathon

## Testing Strategy

### 1. Phase Transition Testing (Critical)
Test the complete 5-phase workflow:

```bash
# Phase 1: Handshake
agent-browser open http://localhost:5173
agent-browser snapshot -i  # Get interactive elements
agent-browser upload @e1 test-image.png
agent-browser fill @e2 "A robot doing a backflip"
agent-browser click @e3  # Analyze button
agent-browser wait --text "I see"  # Wait for Sparky response

# Phase 2: Prompt Builder
agent-browser wait --text "Let's build"
agent-browser fill @e4 "Smooth and shiny"
agent-browser click @e5  # Next question
# Repeat for 4 questions

# Phase 3-5: Similar patterns
```

### 2. Animation Verification
Verify Framer Motion animations render correctly:

```bash
# Check code block animations
agent-browser snapshot -i
agent-browser screenshot phase2-codeblocks.png

# Verify stagger effect timing
agent-browser eval "document.querySelectorAll('.code-block').length"
```

### 3. Responsive Design Testing
Test across viewport sizes:

```bash
# Mobile (iPhone 14)
agent-browser set device "iPhone 14"
agent-browser open http://localhost:5173
agent-browser screenshot mobile-phase1.png

# Tablet (iPad)
agent-browser set device "iPad Pro"
agent-browser screenshot tablet-phase1.png

# Desktop
agent-browser set viewport 1920 1080
agent-browser screenshot desktop-phase1.png
```

### 4. Error Handling Testing
Verify graceful failures:

```bash
# Test without API key
VITE_GEMINI_API_KEY="" agent-browser open http://localhost:5173
agent-browser click @analyze-button
agent-browser wait --text "error"  # Should show user-friendly error

# Test with invalid image
agent-browser upload @e1 invalid.txt
# Should show validation error
```

### 5. API Integration Testing
Test Gemini API interactions:

```bash
# Vision API
agent-browser open http://localhost:5173
agent-browser upload @e1 test-robot.png
agent-browser fill @e2 "A robot"
agent-browser click @analyze
agent-browser wait 5000  # Wait for API response
agent-browser get text @sparky-response

# Text generation API
# (Phase 2 question generation)
agent-browser wait --text "How does your"
```

## Test Scenarios

### Critical Path (Must Pass)
1. **Complete 5-phase workflow** - Upload → Q&A → Generate → Refine → Trophy
2. **Image upload validation** - PNG/JPG only, 5MB max
3. **Character limits** - Intent (200 chars), Answers (100 chars)
4. **Phase transitions** - Data flows correctly between phases
5. **Gemini API integration** - Vision and text generation working
6. **Loading states** - Spinners show during API calls
7. **Error states** - User-friendly messages on failures

### Important (Should Pass)
1. **Back navigation** - Phase 2 → Phase 1 preserves state
2. **Progress tracking** - Question X of 4, percentage bar
3. **Code block animations** - Spring physics, stagger effect
4. **Sparky states** - Waiting, thinking, success animations
5. **Responsive design** - Mobile, tablet, desktop layouts
6. **Accessibility** - Keyboard navigation, ARIA labels

### Nice to Have (Can Defer)
1. **Browser compatibility** - Chrome, Firefox, Safari
2. **Performance** - 60fps animations, <2s load time
3. **Offline handling** - Graceful degradation
4. **Session persistence** - Save/load projects

## Testing Workflow

### During Development
```bash
# Start dev server
npm run dev

# In another terminal, run agent-browser tests
agent-browser open http://localhost:5173
agent-browser snapshot -i
# Manual testing commands
```

### Before Commits
```bash
# TypeScript check
npm run build

# ESLint check
npm run lint

# Visual regression (manual)
agent-browser open http://localhost:5173
agent-browser screenshot current-state.png
# Compare with previous screenshots
```

### Before Submission
```bash
# Full workflow test
agent-browser open http://localhost:5173
# Complete all 5 phases manually
agent-browser screenshot final-trophy.png

# Production build test
npm run build
npm run preview
agent-browser open http://localhost:4173
# Repeat critical path tests
```

## Test Data

### Sample Images
Store test images in `kidcreatives-ai/tests/fixtures/`:
- `robot-sketch.png` - Simple robot drawing
- `cat-drawing.jpg` - Cat sketch
- `monster-complete.png` - Detailed monster
- `invalid.txt` - For error testing
- `oversized.png` - >5MB for validation testing

### Sample Inputs
**Intent Statements:**
- "A robot doing a backflip in space"
- "A friendly cat wearing a wizard hat"
- "A purple monster eating ice cream"

**Q&A Answers:**
- Texture: "Smooth and shiny", "Fluffy like a cloud"
- Lighting: "Bright sunny day", "Neon lights"
- Mood: "Super happy and playful", "Mysterious"
- Background: "Floating in space", "Deep in a forest"
- Style: "Cartoon like a comic book", "Pixel art"

## agent-browser Best Practices

### 1. Use Refs Over Selectors
```bash
# ✅ Good - deterministic
agent-browser snapshot -i
agent-browser click @e2

# ❌ Avoid - brittle
agent-browser click "#analyze-button"
```

### 2. Use Interactive Snapshots
```bash
# ✅ Good - only interactive elements
agent-browser snapshot -i

# ❌ Avoid - too much noise
agent-browser snapshot
```

### 3. Wait for Dynamic Content
```bash
# ✅ Good - wait for specific text
agent-browser wait --text "I see"

# ❌ Avoid - arbitrary timeouts
agent-browser wait 3000
```

### 4. Use JSON Output for Automation
```bash
# ✅ Good - parseable output
agent-browser snapshot -i --json | jq '.elements'

# ❌ Avoid - human-readable only
agent-browser snapshot -i
```

### 5. Session Isolation
```bash
# ✅ Good - isolated test sessions
agent-browser --session test1 open http://localhost:5173
agent-browser --session test2 open http://localhost:5173

# ❌ Avoid - shared state
agent-browser open http://localhost:5173
```

## Debugging Tests

### Visual Debugging
```bash
# Run in headed mode (show browser)
agent-browser --headed open http://localhost:5173

# Take screenshots at each step
agent-browser screenshot step1.png
agent-browser click @e1
agent-browser screenshot step2.png
```

### Console Debugging
```bash
# View console messages
agent-browser console

# View JavaScript errors
agent-browser errors

# Highlight elements
agent-browser highlight @e1
```

### Trace Recording
```bash
# Start trace
agent-browser trace start test-trace.zip

# Run test commands
agent-browser open http://localhost:5173
agent-browser click @e1

# Stop and save trace
agent-browser trace stop test-trace.zip
# Open in Playwright Trace Viewer
```

## Integration with Kiro CLI

### MCP Server Configuration
Already configured in `.kiro/settings/mcp.json`:
```json
{
  "agent-browser": {
    "command": "agent-browser",
    "args": ["mcp"],
    "env": {}
  }
}
```

### Using with Kiro Prompts
```bash
# In Kiro CLI chat
> Use agent-browser to test Phase 1 handshake flow

# Kiro will automatically invoke agent-browser via MCP
```

## Test Documentation

### Test Reports
Document test results in DEVLOG.md:
```markdown
#### Testing Session (Date)
**Duration**: X minutes

##### Tests Run
- ✅ Phase 1-2 complete workflow
- ✅ Image upload validation
- ✅ Character limit enforcement
- ❌ Phase 3 generation (not implemented yet)

##### Issues Found
1. **Issue**: Code blocks not animating on mobile
   - **Severity**: Medium
   - **Fix**: Added viewport meta tag
   - **Status**: ✅ Resolved
```

### Screenshots
Store test screenshots in `kidcreatives-ai/tests/screenshots/`:
- `phase1-initial.png`
- `phase1-uploaded.png`
- `phase2-question1.png`
- `phase2-complete.png`

## Performance Testing

### Load Time Testing
```bash
# Measure initial load
agent-browser open http://localhost:5173
agent-browser eval "performance.timing.loadEventEnd - performance.timing.navigationStart"
# Target: <2000ms
```

### Animation Performance
```bash
# Check frame rate
agent-browser eval "
  let frames = 0;
  let lastTime = performance.now();
  requestAnimationFrame(function count() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      console.log('FPS:', frames);
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(count);
  });
"
# Target: 60fps
```

### Bundle Size Testing
```bash
# Check production bundle
npm run build
du -sh kidcreatives-ai/dist
# Target: <300KB gzipped
```

## Accessibility Testing

### Keyboard Navigation
```bash
agent-browser open http://localhost:5173
agent-browser press Tab  # Should focus first interactive element
agent-browser press Tab  # Next element
agent-browser press Enter  # Activate
```

### Screen Reader Testing
```bash
# Get accessibility tree
agent-browser snapshot
# Verify ARIA labels present
```

### Color Contrast
```bash
# Check contrast ratios
agent-browser eval "
  const colors = {
    'subject-blue': '#4A90E2',
    'variable-purple': '#9B59B6',
    'context-orange': '#E67E22'
  };
  // Verify WCAG AA compliance (4.5:1 for text)
"
```

## Continuous Testing

### Pre-commit Hook (Future)
```bash
# .git/hooks/pre-commit
#!/bin/bash
npm run lint
npm run build
agent-browser open http://localhost:5173
agent-browser snapshot -i --json > snapshot.json
# Compare with baseline
```

### CI/CD Integration (Future)
```yaml
# .github/workflows/test.yml
- name: Install agent-browser
  run: npm install -g agent-browser && agent-browser install
  
- name: Run tests
  run: |
    npm run dev &
    sleep 5
    agent-browser open http://localhost:5173
    agent-browser snapshot -i
```

## Testing Checklist

### Before Each Commit
- [ ] TypeScript compiles (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Dev server starts (`npm run dev`)
- [ ] No console errors in browser

### Before Each Phase Completion
- [ ] Phase component renders correctly
- [ ] Phase transitions work (forward and back)
- [ ] Loading states show during API calls
- [ ] Error states show on failures
- [ ] Animations are smooth (60fps)
- [ ] Responsive on mobile, tablet, desktop
- [ ] agent-browser test script passes

### Before Submission
- [ ] All 5 phases complete
- [ ] Full workflow tested end-to-end
- [ ] Production build successful
- [ ] Bundle size within target (<300KB)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Screenshots captured for README
- [ ] Demo video recorded
- [ ] DEVLOG.md updated with test results

---

**Last Updated**: January 28, 2026  
**agent-browser Version**: 0.8.4  
**Status**: ✅ Configured and ready for testing
