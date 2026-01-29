# Plan: Fix First Question Code Block Not Appearing (Race Condition)

**Issue**: After answering Question 1 in the Prompt Builder phase, the code block does not appear in the Prompt Engine. However, Questions 2, 3, and 4 code blocks appear correctly.

**Root Cause**: Race condition between state updates and next question generation.

---

## Problem Analysis

### Current Flow (Lines 70-102 in PromptBuilderPhase.tsx)

```typescript
const handleSubmitAnswer = async () => {
  if (!currentAnswer.trim() || !question) return

  // Step 1: Add answer (async state update)
  addAnswer(
    question.variable,
    question.question,
    currentAnswer.trim(),
    question.colorCategory
  )

  setCurrentAnswer('')

  // Step 2: IMMEDIATELY generate next question
  const nextIndex = promptState.currentQuestionIndex + 1
  if (nextIndex < questions.length) {
    const nextQuestion = questions[nextIndex]
    const personalizedTemplate = personalizeQuestion(
      nextQuestion.questionTemplate,
      intentStatement
    )
    
    setSparkyMessage("Great answer! Let's keep going...")
    
    // This calls setQuestion(null) in useGeminiText hook
    await generateQuestion(
      intentStatement,
      visionAnalysis,
      nextQuestion.variable,
      personalizedTemplate,
      nextQuestion.colorCategory
    )
  }
}
```

### The Race Condition

1. **Line 73-77**: `addAnswer()` called → schedules state update for `promptState.variables`
2. **Line 83**: Uses `promptState.currentQuestionIndex` (still old value = 0)
3. **Line 95**: `generateQuestion()` called → calls `setQuestion(null)` in useGeminiText
4. **Component re-renders** with `question = null`
5. **State update completes** → `promptState.variables` updated
6. **But**: The timing might cause the first code block to not render properly

### Why Questions 2, 3, 4 Work

By the time Question 2 is answered, the state from Question 1 has already settled, so there's no race condition.

---

## Solution Approach

We need to ensure the state update from `addAnswer()` completes before generating the next question. However, `addAnswer()` doesn't return a Promise, so we can't await it.

### Option 1: Use useEffect to Trigger Next Question (Recommended)

Instead of immediately generating the next question, let a `useEffect` watch for `promptState.currentQuestionIndex` changes and generate the next question when it updates.

### Option 2: Add Delay Before Next Question

Add a small delay (e.g., 100ms) to allow state to settle before generating next question.

### Option 3: Make addAnswer Return a Promise

Modify `usePromptState` hook to return a Promise from `addAnswer` so we can await it.

**Recommendation**: Option 1 is cleanest and most React-idiomatic.

---

## Implementation Plan (Option 1)

### Step 1: Remove Next Question Generation from handleSubmitAnswer

**Current** (lines 70-102):
```typescript
const handleSubmitAnswer = async () => {
  if (!currentAnswer.trim() || !question) return

  addAnswer(
    question.variable,
    question.question,
    currentAnswer.trim(),
    question.colorCategory
  )

  setCurrentAnswer('')

  const nextIndex = promptState.currentQuestionIndex + 1
  if (nextIndex < questions.length) {
    const nextQuestion = questions[nextIndex]
    const personalizedTemplate = personalizeQuestion(
      nextQuestion.questionTemplate,
      intentStatement
    )
    
    setSparkyMessage("Great answer! Let's keep going...")
    
    await generateQuestion(
      intentStatement,
      visionAnalysis,
      nextQuestion.variable,
      personalizedTemplate,
      nextQuestion.colorCategory
    )
  } else {
    setSparkyMessage("Awesome! You've built a complete AI prompt! Ready to see your creation come to life?")
  }
}
```

**Change to**:
```typescript
const handleSubmitAnswer = () => {
  if (!currentAnswer.trim() || !question) return

  addAnswer(
    question.variable,
    question.question,
    currentAnswer.trim(),
    question.colorCategory
  )

  setCurrentAnswer('')
  setSparkyMessage("Great answer! Let's keep going...")
}
```

### Step 2: Add useEffect to Generate Next Question

**Add after existing useEffects** (around line 65):

```typescript
// Generate next question when currentQuestionIndex changes
useEffect(() => {
  const currentIndex = promptState.currentQuestionIndex
  
  // Skip if we're on the first question (handled by initial useEffect)
  if (currentIndex === 0) return
  
  // Skip if we've completed all questions
  if (currentIndex >= questions.length) {
    setSparkyMessage("Awesome! You've built a complete AI prompt! Ready to see your creation come to life?")
    return
  }
  
  // Generate next question
  const nextQuestion = questions[currentIndex]
  const personalizedTemplate = personalizeQuestion(
    nextQuestion.questionTemplate,
    intentStatement
  )
  
  generateQuestion(
    intentStatement,
    visionAnalysis,
    nextQuestion.variable,
    personalizedTemplate,
    nextQuestion.colorCategory
  )
}, [promptState.currentQuestionIndex, questions, intentStatement, visionAnalysis, generateQuestion])
```

---

## Alternative: Option 2 (Simpler, Less Ideal)

Add a small delay before generating next question:

```typescript
const handleSubmitAnswer = async () => {
  if (!currentAnswer.trim() || !question) return

  addAnswer(
    question.variable,
    question.question,
    currentAnswer.trim(),
    question.colorCategory
  )

  setCurrentAnswer('')

  // Wait for state to settle
  await new Promise(resolve => setTimeout(resolve, 50))

  const nextIndex = promptState.currentQuestionIndex + 1
  if (nextIndex < questions.length) {
    // ... rest of code
  }
}
```

---

## Testing Checklist

- [ ] Start fresh workflow from Phase 1
- [ ] Complete Phase 1 (upload + intent)
- [ ] Enter Phase 2 (Prompt Builder)
- [ ] Answer Question 1
- [ ] **Verify code block appears immediately** ✅
- [ ] Answer Question 2
- [ ] Verify 2 code blocks visible
- [ ] Answer Question 3
- [ ] Verify 3 code blocks visible
- [ ] Answer Question 4
- [ ] Verify 4 code blocks visible
- [ ] Complete Phase 2
- [ ] Verify all 4 answers in synthesized prompt

---

## Files to Modify

1. **kidcreatives-ai/src/components/phases/PromptBuilderPhase.tsx**
   - Simplify `handleSubmitAnswer` (remove next question logic)
   - Add new `useEffect` to handle next question generation

**Total**: 1 file, ~30 lines changed

---

**Estimated Time**: 10 minutes  
**Complexity**: Medium  
**Recommended Approach**: Option 1 (useEffect-based)

