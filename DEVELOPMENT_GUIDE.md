# 🚀 LinguaNet Development Guide

## 📋 Git Workflow & Team Development

### Branch Strategy

```
main (production) ← develop ← feature branches
```

1. **`main`** - Production branch (auto-deploys to https://linguanet.vercel.app)
2. **`develop`** - Development branch (auto-deploys to preview URL)
3. **`feature/*`** - Feature branches (created from develop)

### 🔄 Development Workflow

#### For New Team Members:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ma-za-kpe/linguanet.git
   cd linguanet
   ```

2. **Create develop branch** (if not exists)
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

#### Working on Features:

1. **Always start from develop**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "✨ Add your feature description"
   ```

4. **Push feature branch**
   ```bash
   git push -u origin feature/your-feature-name
   ```

5. **Create Pull Request to develop**
   - Go to GitHub
   - Create PR: `feature/your-feature-name` → `develop`
   - Get code review
   - Merge after approval

6. **Deploy to production** (only from develop)
   ```bash
   git checkout develop
   git pull origin develop
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

### 🛡️ Code Quality Rules

#### ESLint Fixes Required:
- ✅ No unused variables or imports
- ✅ Escape quotes in JSX (`&quot;`, `&apos;`, `&ldquo;`, `&rdquo;`)
- ✅ All builds must pass before merge

#### Commit Message Format:
```
✨ feat: add new feature
🐛 fix: bug fix
📚 docs: documentation
🎨 style: formatting, missing semicolons, etc.
♻️  refactor: code restructure
🧪 test: adding tests
🚀 deploy: deployment related
```

### 📁 Project Structure

```
linguanet/
├── app/                    # Next.js App Router
│   ├── contribute/         # Contributor interface
│   ├── dashboard/          # AI company dashboard
│   ├── pitch/             # Pitch deck
│   └── page.tsx           # Landing page
├── contracts/             # Smart contracts
├── public/               # Static assets
├── .github/workflows/    # CI/CD pipelines
└── scripts/              # Utility scripts
```

### 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically

# Deployment (automatic via GitHub Actions)
# develop → https://linguanet-dev.vercel.app
# main → https://linguanet.vercel.app
```

### 🌍 Environment Setup

#### Required Environment Variables:
```bash
# Add to Vercel dashboard or .env.local
NEXT_TELEMETRY_DISABLED=1
```

#### GitHub Secrets (for deployment):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` 
- `VERCEL_PROJECT_ID`

### 🧪 Testing Your Changes

1. **Local testing**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

2. **Build testing**
   ```bash
   npm run build
   npm run start
   ```

3. **Lint checking**
   ```bash
   npm run lint
   ```

### 🎯 Feature Development Guidelines

#### Adding New Languages:
1. Update `mockDatasets` in `/app/dashboard/page.tsx`
2. Add flag emoji and realistic sample data
3. Include native script text samples

#### UI/UX Guidelines:
- Use high contrast colors (`#1a1a1a` not `#666`)
- Font weights: 600-800 for readability
- Follow existing animation patterns (Framer Motion)
- Mobile-first responsive design

#### Performance:
- Keep bundle size minimal
- Use Next.js Image component for images
- Optimize animations for 60fps

### 🐛 Common Issues & Solutions

**Build fails with ESLint errors:**
```bash
npm run lint:fix
```

**Vercel deployment fails:**
- Check GitHub secrets are set
- Ensure all tests pass locally

**Merge conflicts:**
```bash
git checkout develop
git pull origin develop
git checkout your-branch
git merge develop
# Resolve conflicts
git commit
```

### 📞 Team Communication

- **Code Reviews**: Required for all PRs
- **Feature Discussions**: Use GitHub Issues
- **Quick Questions**: GitHub Discussions
- **Urgent Issues**: Tag @ma-za-kpe in PR/Issue

---

## 🎯 Ready to Contribute?

1. Read this guide completely
2. Set up your development environment
3. Create your first feature branch
4. Make LinguaNet even better! 🚀

**Happy coding!** 🌍💻