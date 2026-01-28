# Product Overview

## Product Purpose
KidCreatives AI transforms AI from a "black box" into a "glass box" for children aged 7-10. Instead of just generating art, it teaches the logic of Large Language Models through an interactive, educational workflow: Analyze → Educate/Collaborate/Refine → Generate. The app turns prompt engineering into a tangible, visual construction process where children see how their creative decisions become technical instructions that power AI generation.

**Core Differentiator**: The specific Analyze-Educate-Generate flow that makes AI literacy accessible to young minds while expanding creativity and building pride in their creations.

## Target Users

### Primary: Children (7-10 years old)
- **Needs**: Fun, engaging interface that feels like a professional studio
- **Learning Style**: Visual, interactive, hands-on construction
- **Motivation**: Creating art, understanding "how things work," earning digital/physical trophies
- **Skill Level**: Can draw sketches, understand basic cause-and-effect, ready for structured learning

### Secondary: Parents/Educators
- **Needs**: Evidence of educational value, tangible learning artifacts
- **Concerns**: Screen time quality, skill development, AI literacy
- **Value**: Physical certificates proving prompt engineering skills, not just gameplay

## Key Features

### Phase 1: The Handshake (Vision + Intent)
- **Image Upload**: Accept sketches or complete drawings as source material
- **Intent Statement**: Text input for describing what the child drew
- **AI Analysis**: Gemini 2.5 Flash Vision compares visual evidence against text claim
- **Trust Building**: AI confirms what it "sees" and asks about ambiguous areas

### Phase 2: The Educational Loop (Prompt Builder)
- **Socratic Questioning**: 3-5 guided questions to fill prompt variables (Texture, Lighting, Mood, Era, etc.)
- **Visual Prompt Construction**: Animated "code blocks" fly into the "Prompt Engine" conveyor belt
- **State Management**: `Prompt_State_JSON` tracks all user decisions
- **Learning Moments**: Each choice becomes a visible technical instruction

### Phase 3: The Realization (Generation)
- **Prompt Synthesis**: Compile JSON into optimized narrative prompt
- **AI Generation**: Gemini 2.5 Flash Image with high structure guidance
- **Side-by-Side Display**: Original sketch vs. AI-enhanced result

### Phase 4: The Refinement (Conversational Editing)
- **Critique System**: AI asks for feedback on generated result
- **Localized Editing**: Gemini Nano Banana inpainting for precise changes
- **Consistency Preservation**: Character stays the same while adding/modifying elements

### Phase 5: The Trophy (Phygital Bridge)
- **Digital Holo-Card**: 3D-tilting trading card with stats derived from `Prompt_State_JSON`
- **Smart Sheet PDF**: CMYK-optimized printable with final image, original sketch, source code prompt, and child's name
- **Physical Artifact**: Downloadable certificate proving prompt engineering skills

## Business Objectives

### Educational Impact
- Teach AI literacy to 7-10 year-olds through hands-on experience
- Demystify Large Language Models by making the process visible
- Build foundational prompt engineering skills

### User Engagement
- High completion rate for full 5-phase workflow
- Repeat usage for multiple creations
- Parent/educator advocacy through tangible learning proof

### Innovation Recognition
- Demonstrate unique "Glass Box" approach to AI education
- Showcase technical sophistication (vision analysis, state management, localized editing)
- Win hackathon categories: Application Quality (40 pts), Innovation (15 pts), Kiro CLI Usage (20 pts)

## User Journey

### Entry Point
1. Child opens app, sees "Constructivist Pop" workspace interface
2. Sparky (robot coach) introduces the studio concept

### Creation Flow
1. **Upload**: Child uploads their drawing (sketch or complete)
2. **Describe**: Child writes intent statement ("A robot doing backflip in space")
3. **Handshake**: Sparky confirms what it sees, asks about unclear parts
4. **Build**: 3-5 questions where child makes creative decisions
   - Each answer animates a code block into the Prompt Engine
   - Child sees the prompt being constructed visually
5. **Generate**: AI creates enhanced version respecting original structure
6. **Refine**: Child requests changes ("Add a planet in the background")
   - AI makes localized edits without regenerating entire image
7. **Trophy**: Child finalizes and receives digital holo-card
8. **Print**: Child downloads printable certificate with "source code"

### Exit Point
- Child has digital trophy in app
- Parent has downloadable PDF proving learning
- Child understands: "My choices → AI instructions → Art"

## Success Criteria

### For Children
- **Engagement**: Complete all 5 phases in single session
- **Understanding**: Can explain "what the AI needed to know" to create their art
- **Pride**: Show off physical certificate to parents/friends
- **Repeat Usage**: Create multiple artworks to build collection

### For Parents/Educators
- **Educational Value**: Clear evidence of prompt engineering learning
- **Quality Time**: Screen time that teaches technical literacy
- **Tangible Output**: Physical artifacts worth keeping

### For Hackathon
- **Application Quality** (40 pts): Fully functional 5-phase workflow, real-world educational value, clean maintainable code
- **Kiro CLI Usage** (20 pts): Extensive use of custom prompts, MCP servers (context7, vercel agent-browser), optimized workflow
- **Documentation** (20 pts): Complete DEVLOG.md, clear README.md, transparent development process
- **Innovation** (15 pts): Unique "Glass Box" approach, visual prompt construction, phygital bridge
- **Presentation** (5 pts): Clear demo video, professional README

### Technical Metrics
- Image analysis accuracy (Gemini 2.5 Flash Vision)
- Generation quality with structure preservation
- Localized edit precision (Nano Banana)
- PDF generation success rate
- Database performance (Supabase auth, chat history, trophy storage)
