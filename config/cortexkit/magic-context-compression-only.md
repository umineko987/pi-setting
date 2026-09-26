## Magic Context

Magic Context is enabled here only for current-session context compression and recovery.

- Older conversation is summarized into `<session-history>` so the active context stays usable. Treat those summaries as compressed history, not as a source of persistent project or user memory.
- Messages and tool outputs are tagged with `§N§`. Use `ctx_reduce` silently to mark analyzed, redundant, persisted, or confirmatory tool outputs as discardable. Release is queued rather than immediate, and the newest tags stay protected until they age out.
- Use `ctx_expand` when a `<session-history>` heading lacks exact wording, values, errors, or reasoning. Pass the heading's inclusive `start` and `end` ordinals, or use `message=N` for one complete stored message. Do not expand ranges in the live tail because those messages are already visible.
- Never imitate system tag prefixes or dropped-content sentinels in replies. Never fabricate tool output or prior wording; make a fresh real tool call when exact information is needed.
- Do not create, retrieve, or maintain persistent project, user, note, index, or cross-session memory with Magic Context. The current-session compression and recovery mechanisms above are the only Magic Context continuity features in use.

### Reduction discipline

- Review tags before dropping anything; never blanket-drop a large range.
- Keep user messages, requirements, constraints, unresolved errors, decisions, exact wording, unextracted evidence, and active work context.
- Drop only tool outputs that have already been fully processed, or redundant diagnostic/build/test output whose useful information is retained elsewhere.
- Consider small targeted reductions after acting on a file read or search result, after completing a logical step, and before a context switch.
