# 🌍 LinguaNet - Turn Your Voice into Value

[![ETHAccra 2025](https://img.shields.io/badge/ETHAccra-2025-brightgreen)](https://ethaccra.xyz)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Decentralized African Language Data Marketplace** - Preserving Languages, Powering AI, Creating Economic Opportunity

LinguaNet enables African language speakers to monetize their linguistic knowledge while providing AI companies with authentic, verified language datasets. Built on blockchain infrastructure with mobile-first UX.

## 🚀 Live Demo

- **Production**: [https://linguanet.vercel.app](https://linguanet.vercel.app)
- **Development**: Auto-deployed from `develop` branch
- **Pitch Deck**: [https://linguanet.vercel.app/pitch](https://linguanet.vercel.app/pitch)

## ✨ Key Features

### For Contributors
- 📱 **No crypto knowledge needed** - Login with phone number
- 🎤 **30-second recordings** - Earn $3 USDC per verified clip
- 💰 **Instant mobile money withdrawal** - MTN, M-Pesa, AirtelTigo
- 🌍 **ENS identity** - Get your own .linguanet.eth name

### For Validators
- ✅ **Quality verification** - $0.50 per validation
- 🏅 **EFP reputation system** - Build on-chain trust
- 🔥 **Streak rewards** - Bonus payments for consistency

### For AI Companies
- 📊 **Verified datasets** - Native speaker quality guaranteed
- 🚀 **API access** - Real-time data streaming
- 💾 **Filecoin storage** - Decentralized, permanent hosting
- 🎯 **12 African languages** - Twi, Swahili, Yoruba, and more

## 🛠️ Quick Start for Developers

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/ma-za-kpe/linguanet.git
cd linguanet

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

```bash
# Development
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically

# Type checking
npm run type-check   # Run TypeScript compiler check
```

## 📁 Project Structure

```
linguanet/
├── app/                    # Next.js App Router
│   ├── contribute/         # Contributor interface ($3/recording)
│   ├── dashboard/          # AI company dataset browser
│   ├── pitch/             # Investor pitch deck
│   └── page.tsx           # Landing page
├── contracts/             # Smart contracts (Base L2)
├── public/               # Static assets, favicon, manifest
├── .github/workflows/    # CI/CD pipelines
└── scripts/              # Utility scripts
```

## 🌐 Tech Stack

### Frontend
- **Next.js 15.5.2** with App Router and Turbopack
- **TypeScript** for type safety
- **Framer Motion** for animations
- **Tailwind CSS** (via custom CSS)
- **React Icons** (Feather Icons)

### Blockchain
- **Base L2** for cheap, fast transactions
- **ENS** for human-readable identities
- **USDC** for stable payments
- **EFP** for reputation and attestations

### Storage & AI
- **Filecoin** for decentralized storage
- **TensorFlow.js** for client-side AI quality checks
- **Custom API** for dataset access

### Deployment
- **Vercel** for hosting and CI/CD
- **GitHub Actions** for automated testing
- **Mobile Money APIs** for cashout

## 🔄 Git Workflow

We use a **develop-first** workflow for team collaboration:

### Branch Strategy
```
main (production) ← develop ← feature/your-feature
```

### For New Contributors

1. **Fork and clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/linguanet.git
   cd linguanet
   ```

2. **Work on develop branch**
   ```bash
   git checkout develop
   git pull origin develop
   ```

3. **Create feature branch**
   ```bash
   git checkout -b feature/awesome-feature
   # Make your changes
   git add .
   git commit -m "✨ Add awesome feature"
   git push -u origin feature/awesome-feature
   ```

4. **Create Pull Request**
   - Target: `feature/awesome-feature` → `develop`
   - Use PR template for description
   - Wait for code review and CI checks

5. **Production deployment** (maintainers only)
   ```bash
   git checkout main
   git merge develop
   git push origin main
   # Auto-deploys to production
   ```

### Commit Message Format
```
✨ feat: add new feature
🐛 fix: bug fix
📚 docs: documentation
🎨 style: formatting
♻️  refactor: code restructure
🧪 test: adding tests
🚀 deploy: deployment related
```

## 🧪 Testing Your Changes

Before submitting a PR, ensure:

```bash
# 1. Code passes linting
npm run lint

# 2. Build succeeds
npm run build

# 3. All pages load correctly
npm run dev
# Visit http://localhost:3000, /contribute, /dashboard, /pitch

# 4. Mobile responsiveness works
# Test on different screen sizes
```

## 🌍 Adding New Languages

To add support for a new African language:

1. **Update mock data** in `/app/dashboard/page.tsx`:
   ```typescript
   const mockDatasets = {
     // Add your language here
     hausa: {
       language: 'Hausa',
       country: 'Nigeria/Niger',
       flag: '🇳🇬',
       clips: 1500,
       // ... other properties
       samples: [
         { text: 'Sannu, ina kwana?' } // Native script sample
       ]
     }
   };
   ```

2. **Add flag emoji** and realistic sample data
3. **Test the dashboard** to ensure proper display
4. **Update documentation** if needed

## 🚨 Common Issues & Solutions

### Build Fails with ESLint Errors
```bash
npm run lint:fix  # Auto-fix most issues
```

### TypeScript Errors
```bash
npm run type-check  # Check without building
```

### Vercel Deployment Fails
- Ensure all environment variables are set
- Check that ESLint and build pass locally
- Review GitHub Actions logs

### Development Server Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 🔐 Environment Variables

For local development, create `.env.local`:

```bash
# Optional - disable Next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# Production settings (Vercel sets these automatically)
VERCEL=1
SKIP_ENV_VALIDATION=1
```

## 🎯 Bounties & Hackathon

**ETHAccra 2025 Integration:**
- ✅ **ENS**: Human-readable identities (kofi.linguanet.eth)
- ✅ **Base**: L2 scaling for micro-payments 
- ✅ **EFP**: Reputation and social attestations
- ✅ **Filecoin**: Decentralized storage for audio files
- ✅ **Buidl Guidl**: Community building and education

**Target Bounties:** $10,300 total potential

## 🤝 Contributing

We welcome contributions! Please:

1. Read our [Development Guide](DEVELOPMENT_GUIDE.md)
2. Check existing issues and PRs
3. Follow the Git workflow above
4. Ensure your PR passes all CI checks
5. Be respectful and collaborative

### Areas We Need Help
- 🌍 **Language experts** for validation accuracy
- 🎨 **UI/UX designers** for mobile optimization  
- 🔐 **Smart contract developers** for tokenomics
- 📱 **Mobile developers** for React Native app
- 🗣️ **Community managers** for African market expansion

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- **ETHAccra 2025** for the amazing hackathon experience
- **Base ecosystem** for L2 infrastructure
- **ENS team** for identity solutions
- **Filecoin** for decentralized storage
- **African language communities** who make this possible

---

**Every Voice Matters. Every Language Counts.** 🌍

Built with ❤️ in Ghana 🇬🇭 | Scaling to Africa 🌍