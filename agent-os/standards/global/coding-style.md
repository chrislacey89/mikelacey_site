## Coding style best practices

- **Consistent Naming Conventions**: Establish and follow naming conventions for variables, functions, classes, and files across the codebase
- **Automated Formatting**: Maintain consistent code style (indenting, line breaks, etc.)
- **Meaningful Names**: Choose descriptive names that reveal intent; always avoid abbreviations and single-letter variables
- **Small, Focused Functions**: Keep functions small and focused on a single task for better readability and testability
- **Consistent Indentation**: Use consistent indentation (spaces or tabs) and configure your editor/linter to enforce it
- **Remove Dead Code**: Delete unused code, commented-out blocks, and imports rather than leaving them as clutter
- **Structure Functions Clearly**: Lead with reasoning and control flow at the top of the module, then tuck supporting logic into hoisted function declarations underneath.
- **Avoid `any`**: Do not introduce TypeScript `any` types. If a rare edge case seems to require one, pause and request approval while explaining the constraint
- **Minimize Coercion**: Prefer implicit, well-typed data flows; avoid manual type coercion unless there is no safer alternative.
- **Backward compatibility only when required:** Unless specifically instructed otherwise, assume you do not need to write additional code logic to handle backward compatibility
- **DRY Principle**: Avoid duplication by extracting common logic into reusable functions or modules
