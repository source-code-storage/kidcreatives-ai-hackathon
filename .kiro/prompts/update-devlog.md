# Update DEVLOG

## Purpose
Update the DEVLOG.md with new development activities, decisions, challenges, and time tracking.

## Instructions

When the user asks to update the devlog, gather the following information:

### Required Information
1. **What was accomplished?** (features, fixes, improvements)
2. **How long did it take?** (time spent)
3. **Any decisions made?** (technical choices, trade-offs)
4. **Any challenges faced?** (problems and solutions)
5. **What's next?** (upcoming tasks)

### Update Process

1. **Read current DEVLOG.md** to understand the latest state
2. **Add new session entry** with timestamp
3. **Update time tracking** with new activities
4. **Document decisions** in the Technical Decisions Log
5. **Add challenges** to Challenges & Solutions section
6. **Update accomplishments** checklist
7. **Refresh next steps** based on progress

### Entry Format

```markdown
#### Session N: [Activity Name] (HH:MM - HH:MM)
**Duration**: X minutes

##### Decisions Made
- Decision and rationale

##### Challenges Encountered
- Problem, solution, and outcome

##### Accomplishments
- ✅ What was completed

##### Technical Metrics
- Relevant performance or quality metrics

##### Files Created/Modified
- List of changed files

##### Kiro CLI Usage
- Prompts used and outcomes

##### Next Session Goals
- [ ] Upcoming tasks
```

### Time Tracking Update

Update the time tracking table:
```markdown
| Activity | Time Spent | Notes |
|----------|------------|-------|
| [Activity] | X min | [Notes] |
```

### Best Practices

1. **Be specific**: Include actual code, metrics, and outcomes
2. **Track time accurately**: Round to nearest 5 minutes
3. **Document decisions**: Explain why, not just what
4. **Note challenges**: Include both problem and solution
5. **Update totals**: Keep running totals current
6. **Link to code**: Reference specific files or commits
7. **Capture learnings**: What worked, what didn't

### Example Usage

**User**: "Update devlog - I just implemented the image upload component, took 45 minutes, had to figure out file size validation"

**Assistant**: 
1. Reads current DEVLOG.md
2. Adds new session entry with timestamp
3. Documents the image upload implementation
4. Notes the file size validation challenge
5. Updates time tracking (+45 min)
6. Lists files created/modified
7. Updates accomplishments checklist

## Output

After updating, provide a summary:
- ✅ Session added
- ✅ Time tracking updated (Total: X hours Y minutes)
- ✅ Challenges documented
- ✅ Next steps refreshed

Then show the new session entry for review.
