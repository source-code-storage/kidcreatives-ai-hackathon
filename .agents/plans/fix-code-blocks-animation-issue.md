# Plan: Fix Code Blocks Disappearing (Framer Motion Animation Issue)

**Issue**: Code blocks from Questions 1 and 2 are not visible in the Prompt Engine, even though the state shows "2 instructions added to your prompt".

**Root Cause**: Framer Motion's `initial="hidden"` is re-applying on every re-render, causing previously rendered code blocks to reset to hidden state.

---

## Problem Analysis

### Current Code (PromptEngine.tsx, lines 42-62)

```typescript
<motion.div
  variants={containerVariants}
  initial="hidden"      // ← PROBLEM: Re-applies on every render
  animate="show"
  className="bg-white border-2 border-gray-300 rounded-lg p-6 min-h-[200px]"
>
  {variables.length === 0 ? (
    <div className="flex items-center justify-center h-full text-gray-400">
      <p className="text-sm">Your code blocks will appear here...</p>
    </div>
  ) : (
    <motion.div className="flex flex-wrap gap-3">
      {variables.map((entry) => (
        <motion.div key={`${entry.variable}-${entry.timestamp}`} variants={itemVariants}>
          <CodeBlock
            variant={entry.colorCategory}
            variable={entry.variable}
            value={entry.answer}
          />
        </motion.div>
      ))}
    </motion.div>
  )}
</motion.div>
```

### The Issue

**Framer Motion Behavior**:
- `initial="hidden"` sets the initial animation state
- When the component re-renders (new variables added), Framer Motion might re-apply `initial`
- This causes all code blocks to reset to `opacity: 0, x: -50`
- Only the **last** code block animates in properly

**Why "2 instructions added" but only 1 visible**:
- State correctly has 2 entries in `variables` array
- Both CodeBlocks are rendered in the DOM
- But Framer Motion animations are conflicting
- Only the most recent code block is visible

---

## Solution Options

### Option 1: Use AnimatePresence with layout (Recommended)

Replace the container animation with `AnimatePresence` and `layout` prop for smooth additions.

### Option 2: Remove initial prop after first render

Use state to track if it's the first render, then remove `initial` prop.

### Option 3: Use mode="wait" or mode="popLayout"

Configure Framer Motion to handle list animations properly.

### Option 4: Simplify animations

Remove container-level animations, only animate individual items.

**Recommendation**: Option 4 (simplest and most reliable)

---

## Implementation Plan (Option 4)

### Change PromptEngine.tsx

**Remove container-level animation**, keep item-level animations:

**Before**:
```typescript
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
  className="bg-white border-2 border-gray-300 rounded-lg p-6 min-h-[200px]"
>
  {variables.length === 0 ? (
    // ...
  ) : (
    <motion.div className="flex flex-wrap gap-3">
      {variables.map((entry) => (
        <motion.div key={`${entry.variable}-${entry.timestamp}`} variants={itemVariants}>
          <CodeBlock ... />
        </motion.div>
      ))}
    </motion.div>
  )}
</motion.div>
```

**After**:
```typescript
<div className="bg-white border-2 border-gray-300 rounded-lg p-6 min-h-[200px]">
  {variables.length === 0 ? (
    <div className="flex items-center justify-center h-full text-gray-400">
      <p className="text-sm">Your code blocks will appear here...</p>
    </div>
  ) : (
    <div className="flex flex-wrap gap-3">
      {variables.map((entry) => (
        <motion.div
          key={`${entry.variable}-${entry.timestamp}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 24
          }}
        >
          <CodeBlock
            variant={entry.colorCategory}
            variable={entry.variable}
            value={entry.answer}
          />
        </motion.div>
      ))}
    </div>
  )}
</div>
```

**Changes**:
1. Remove `motion.div` wrapper from container
2. Remove `variants`, `initial`, `animate` from container
3. Remove `variants` from item `motion.div`
4. Add inline `initial`, `animate`, `transition` to each item
5. Keep unique `key` for proper React reconciliation

**Why this works**:
- Each code block animates independently
- No container-level animation to interfere
- New items animate in, existing items stay visible
- Simpler and more predictable

---

## Alternative: Option 1 (More Complex, Better UX)

Use `AnimatePresence` with `layout` for smooth list animations:

```typescript
<div className="bg-white border-2 border-gray-300 rounded-lg p-6 min-h-[200px]">
  {variables.length === 0 ? (
    <div className="flex items-center justify-center h-full text-gray-400">
      <p className="text-sm">Your code blocks will appear here...</p>
    </div>
  ) : (
    <div className="flex flex-wrap gap-3">
      <AnimatePresence mode="popLayout">
        {variables.map((entry) => (
          <motion.div
            key={`${entry.variable}-${entry.timestamp}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 24
            }}
          >
            <CodeBlock
              variant={entry.colorCategory}
              variable={entry.variable}
              value={entry.answer}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )}
</div>
```

**Benefits**:
- Smooth layout shifts when new items added
- Exit animations if items removed
- Better visual feedback

**Drawbacks**:
- More complex
- Requires `AnimatePresence` import

---

## Testing Checklist

- [ ] Start fresh workflow
- [ ] Complete Phase 1
- [ ] Enter Phase 2
- [ ] Answer Question 1
- [ ] **Verify 1 code block visible** ✅
- [ ] Answer Question 2
- [ ] **Verify 2 code blocks visible** ✅
- [ ] Answer Question 3
- [ ] **Verify 3 code blocks visible** ✅
- [ ] Answer Question 4
- [ ] **Verify 4 code blocks visible** ✅
- [ ] Check "X instructions added" matches visible count
- [ ] Verify animations are smooth
- [ ] Complete Phase 2 and check synthesized prompt

---

## Files to Modify

1. **kidcreatives-ai/src/components/ui/PromptEngine.tsx**
   - Remove container-level motion.div
   - Simplify item-level animations
   - Remove containerVariants and itemVariants (or keep for reference)

**Total**: 1 file, ~20 lines changed

---

**Estimated Time**: 5 minutes  
**Complexity**: Low  
**Recommended Approach**: Option 4 (simplify animations)
