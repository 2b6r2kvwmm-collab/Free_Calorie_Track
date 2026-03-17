# Dev Server Cleanup Guide

## The Problem

**Multiple dev servers can run simultaneously and cause issues:**
- Old servers run stale code from previous sessions
- Pages show outdated content
- Changes don't appear even after rebuilding
- Hard to debug because "it works locally" (but which localhost?)

### What Happened (March 17, 2026)

Multiple `astro dev` servers were running from different sessions:
- One from March 12 (Wed)
- One from March 16 (Thu)
- One from current session (Mon)

When testing `/calorie-counter`, the browser connected to an old server without the new page, causing confusion.

## How to Prevent This

### Before Starting Dev Work:

**1. Check for running dev servers:**
```bash
ps aux | grep -E "(astro dev|npm.*dev|vite)" | grep -v grep
```

**2. Kill all old servers:**
```bash
pkill -f "astro dev"
pkill -f "npm run dev"
pkill -f "vite"
```

**3. Start fresh:**
```bash
cd blog-astro && npm run dev
# Or for main app:
cd calorie-tracker && npm run dev
```

### Quick Command to Clean Up:

Add this to your workflow before starting dev:
```bash
# Kill all dev servers and start fresh
pkill -f "astro dev" && pkill -f "npm run dev" && sleep 2 && cd blog-astro && npm run dev
```

## How to Identify the Issue

**Symptoms:**
- "My changes aren't showing up"
- "The page is missing even though it built successfully"
- "It works in production but not locally"
- Different behavior on different browser tabs

**Diagnosis:**
```bash
# Check what's running
lsof -i :4321  # Astro default port
lsof -i :5173  # Vite default port
lsof -i :3000  # Common dev port

# Or simpler:
ps aux | grep dev
```

## Best Practices

1. **One terminal per project** - Don't run multiple terminals with dev servers
2. **Kill servers when done** - Press Ctrl+C to stop cleanly
3. **Check ports before starting** - Use the diagnosis commands above
4. **Use dedicated terminals** - Keep dev server terminal separate from git/build terminals
5. **Background processes** - If Claude Code starts a background dev server, it may outlive the session

## Common Port Conflicts

| Port | Service | Command to Kill |
|------|---------|-----------------|
| 4321 | Astro | `pkill -f "astro dev"` |
| 5173 | Vite | `pkill -f "vite"` |
| 3000 | React/Node | `lsof -ti:3000 \| xargs kill -9` |

## Related Issues

This is similar to the meta tag duplication issue - both are "hidden state" problems:
- Meta tags: Static HTML vs React Helmet state
- Dev servers: Multiple background processes running stale code

Both require explicit cleanup and documentation to prevent recurrence.
