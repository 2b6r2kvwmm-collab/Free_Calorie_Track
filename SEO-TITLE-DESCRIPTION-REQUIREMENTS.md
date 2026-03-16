# SEO Title & Meta Description Requirements

## ⚠️ CRITICAL: CHECK EVERY BLOG POST

### Title Requirements
- **Maximum length:** 60-65 characters (Bing requirement)
- **Optimal length:** 50-60 characters
- **Check length before committing**
- **CRITICAL:** Include primary keyword near the beginning
- **CRITICAL:** Include actual search queries users type (e.g., "how many calories", "how to calculate")
- Use question format when appropriate (higher engagement)
- Make it compelling and click-worthy
- **DON'T sacrifice SEO value just to save characters** - shorten strategically

**Example:**
- ❌ "Calorie Deficit Calculator: How Many Calories Should I Eat to Lose Weight?" (79 chars - TOO LONG)
- ❌ "Calorie Deficit Calculator for Safe Weight Loss" (47 chars - TOO GENERIC, lost SEO value)
- ✅ "Calorie Deficit Calculator: How Many Calories to Eat?" (55 chars - GOOD: includes target keywords + question format)

### Meta Description Requirements
- **Required length:** 120-160 characters (Bing requirement)
- **Optimal length:** 140-155 characters
- **Check length before committing**
- Include primary keyword
- **Use natural search language** (e.g., "to lose weight safely" NOT "for safe weight loss")
- Include call-to-action or value proposition
- Be descriptive and compelling

**Example:**
- ❌ "Calculate your safe calorie deficit for weight loss. Free calculator with personalized targets based on your TDEE. Includes portion control tips and meal planning guidance." (179 chars - TOO LONG)
- ✅ "Free calorie deficit calculator with personalized targets based on your TDEE. Ensures safe weight loss with research-backed guidelines." (137 chars - GOOD)

## Pre-Commit Checklist

Before committing any blog post:

```bash
# Count title characters
echo "Title length: $(wc -c <<< 'YOUR_TITLE_HERE' | xargs)"

# Count description characters
echo "Description length: $(wc -c <<< 'YOUR_DESCRIPTION_HERE' | xargs)"
```

### ✅ Must verify:
- [ ] Title is 60-65 characters or less
- [ ] Description is 120-160 characters
- [ ] Both include primary keyword
- [ ] Both are compelling and accurate

## Why This Matters

**Bing penalties for incorrect lengths:**
- Title too long: Gets truncated in search results, looks unprofessional
- Description too long: Gets truncated, loses call-to-action
- Description too short (<120): Flagged as insufficient in Bing Webmaster Tools

**Google is more forgiving** (allows ~70 chars for title, ~160 for description) but Bing is stricter.

## How to Shorten Titles Without Losing SEO Value

**Strategy: Remove filler words, not keywords**

Examples:
- Original: "How Many Calories Should I Eat to Lose Weight?" (50 chars)
- ✅ Keep: "How Many Calories to Eat?" (27 chars) - preserves search query
- ❌ Avoid: "Calorie Guide" (13 chars) - too generic, loses intent

**Words you can often cut:**
- "Should I" → remove or shorten to action
- "to Lose Weight" → implied by "calorie deficit"
- "Complete Guide to" → usually unnecessary
- "Everything You Need to Know About" → too long

**Words you MUST keep:**
- Primary keyword (e.g., "calorie deficit calculator")
- Core search query (e.g., "how many calories")
- Question words if relevant (e.g., "how", "what", "why")

## Common Mistakes to Avoid

1. ❌ Writing naturally without checking character count
2. ❌ Making title generic to save characters (loses SEO value)
3. ❌ Removing keywords instead of filler words
4. ❌ Including too many details in description
5. ❌ Forgetting to verify before committing

## Solution

**Always check character counts BEFORE creating the blog post frontmatter!**
