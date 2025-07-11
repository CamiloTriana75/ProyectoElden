# Contributing to Sports Field Reservation System

Thank you for your interest in contributing to our sports field reservation system! This document provides guidelines and information for contributors.

## How to Contribute

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/project-name.git
cd project-name
```

### 2. Create a Branch
```bash
# Create a descriptive branch name
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Make Your Changes
- Follow the existing code style
- Write clear, descriptive commit messages
- Test your changes thoroughly
- Update documentation if needed

### 4. Commit Your Changes
```bash
git add .
git commit -m "Add feature: brief description of changes"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
# Then create a Pull Request on GitHub
```

## Development Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Firebase account (for backend functionality)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Issue Labels

We use labels to categorize issues:

- `good first issue`: Perfect for new contributors
- `help wanted`: Needs extra help
- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation improvements
- `high priority`: Critical issues
- `medium priority`: Important but not urgent
- `low priority`: Nice to have

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Follow React best practices
- Use proper prop types

### Styling
- Use TailwindCSS for styling
- Follow responsive design principles
- Maintain consistent design patterns

### File Structure
- Keep components in appropriate folders
- Use descriptive file names
- Group related functionality together

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test on different browsers and devices

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation is updated
- [ ] No console errors
- [ ] Responsive design works

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] All tests pass

## Screenshots (if applicable)
```

## Getting Help

- Check existing issues first
- Use the issue template when creating new issues
- Be specific about the problem
- Include steps to reproduce

## Code of Conduct

- Be respectful and inclusive
- Help others learn
- Give constructive feedback
- Follow the project's coding standards

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
