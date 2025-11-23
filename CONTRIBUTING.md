# Contributing to Foliox

Thank you for your interest in contributing to Foliox! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Relevant error messages or logs

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:
- A clear description of the feature
- Use cases and examples
- Potential implementation approach (if you have ideas)
- Any relevant references or examples

### Pull Requests

1. **Fork the repository** and create a branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes** with clear, descriptive commit messages
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

5. **Push to your fork** and open a Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Update documentation** if you've changed functionality

## Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/foliox.git
   cd foliox
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper types or `unknown`
- Define interfaces for data structures
- Use type inference where appropriate

### Code Style

- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Keep functions focused and single-purpose
- Add comments for complex logic, but avoid obvious comments
- Maximum line length: 100 characters (soft limit)

### File Organization

- Keep related functionality together
- Use the existing directory structure
- Place new utilities in appropriate `lib/utils/` files
- Create new modules in `lib/modules/` if needed

### API Routes

- Use proper HTTP methods (GET, POST, etc.)
- Return appropriate status codes
- Handle errors gracefully with clear error messages
- Validate input data
- Use TypeScript types for request/response

### Database

- Use Prisma migrations for schema changes
- Add indexes for frequently queried fields
- Keep migrations focused and atomic
- Test migrations on a copy of production data

### Components

- Use functional components with TypeScript
- Keep components focused and reusable
- Use Shadcn/ui components when possible
- Follow the existing component structure

## Testing

Before submitting a PR:

1. **Lint your code:**
   ```bash
   npm run lint
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Test manually:**
   - Test the feature you added
   - Test edge cases and error scenarios
   - Verify no console errors

## Commit Message Guidelines

Use clear, descriptive commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests when applicable

Examples:
```
Add custom URL validation
Fix GitHub API rate limit handling
Update README with deployment instructions
```

## Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Add comments** to complex code sections
3. **Ensure all tests pass** and the build succeeds
4. **Request review** from maintainers
5. **Address feedback** promptly and professionally

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] All tests pass (`npm run build`)
- [ ] Linter passes (`npm run lint`)
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear and descriptive
- [ ] No console errors or warnings

## Areas for Contribution

We welcome contributions in these areas:

- **Bug fixes**: Fix issues reported in the issue tracker
- **Features**: Implement features from the roadmap
- **Documentation**: Improve README, code comments, or guides
- **Performance**: Optimize queries, caching, or rendering
- **Testing**: Add unit tests or integration tests
- **UI/UX**: Improve component design or user experience
- **Accessibility**: Improve keyboard navigation, screen reader support, etc.

## Questions?

If you have questions about contributing:

- Open an issue with the `question` label
- Check existing issues and discussions
- Review the codebase and documentation

## License

By contributing to Foliox, you agree that your contributions will be licensed under the GNU General Public License v3.0.

Thank you for contributing to Foliox!

