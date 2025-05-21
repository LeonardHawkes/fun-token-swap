# 🪙 Fun.xyz Token Swap Interface

This is a take-home project for the Product Engineer role at **Fun.xyz**. The goal is to create a simple React web application that allows users to explore token values by selecting two tokens (source and target) and entering a USD amount to see their respective values.

## 🚀 Project Overview

The application lets users:
- Select two crypto tokens (e.g., USDC and ETH)
- Enter a USD amount
- View the equivalent value of that USD amount in both tokens
- Swap source and target tokens with one click
- Reset all selections easily

This interface simulates a basic token swap preview tool — commonly found on decentralized finance (DeFi) platforms.

## 🌐 Live Demo

[View the working application on Vercel](https://fun-token-swap.vercel.app/)

---

## 🎨 Design Approach & Process
User Interface
I aimed for a clean, intuitive interface following the wireframe provided, while adding some enhancements for better user experience:

Progressive Disclosure: The target token selector only appears after a source token is selected, guiding users through a step-by-step process
Token Swap Button: Added a dedicated swap button that appears only when both tokens are selected
Visual Feedback: Used Bootstrap cards with color-coded headers to clearly separate different sections
Responsive Design: Implemented a mobile-friendly layout using Bootstrap's grid system
Error States: Created proper loading states and error handling with user-friendly messages

## 🛠️ Technologies Used

- **React** with **TypeScript**
- **Bootstrap 5** for responsive UI
- `@funkit/api-base` package for token metadata and price information
- **Vercel** for deployment

---

## ✅ Implemented Features

- [x] Fetch and maintain a list of supported tokens (USDC, ETH, USDT, WBTC)
- [x] Allow users to select a source and target token
- [x] USD amount input field with formatting
- [x] Fetch token metadata and price info using Fun.xyz's API
- [x] Calculate and display token amounts for both selections
- [x] Swap functionality between source and target tokens
- [x] Reset button to clear all selections
- [x] Handle loading and error states gracefully
- [x] Responsive and accessible UI
- [x] Deploy to Vercel

---

## 📦 API Implementation

Using `@funkit/api-base`:

```ts
getAssetErc20ByChainAndSymbol({ chainId, symbol, apiKey })
getAssetPriceInfo({ chainId, assetTokenAddress, apiKey })
```

## 🚧 Challenges and Solutions

During development and deployment, several challenges were encountered:

### 1. Dependency Conflicts

**Issue**: Conflicts between TypeScript versions required by react-scripts (v3-4) and viem (v5+).

**Solution**: Used an older viem version (v1.x) compatible with TypeScript 4.9.5 and added the `--legacy-peer-deps` flag during installation.

### 2. Swap Button Logic

**Issue**: When swapping tokens, the source token change would trigger a useEffect that cleared the target token.

**Solution**: Implemented a ref-based flag to track when a swap operation was in progress, preventing the target token from being cleared during swaps.

### 3. Deployment Issues

**Issue**: Initial deployments to Netlify and Vercel failed due to:
- Dependency conflicts between TypeScript and React
- Missing environment variables
- Template URL issues with %PUBLIC_URL% not being properly replaced

**Solution**:
- Created a proper Vercel configuration with specific build settings
- Added environment variables directly in Vercel dashboard
- Fixed template URL issues by using absolute paths in index.html
- Created a .env file for local development

### 4. API Error Handling

**Issue**: API calls could fail, leading to a broken UI or white screen.

**Solution**: Implemented comprehensive error handling with user-friendly error messages and fallback token data when API calls fail.

## 🔧 Local Development

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/LeonardHawkes/fun-token-swap.git

# Change directory
cd fun-token-swap

# Install dependencies
npm install --legacy-peer-deps

# Create a .env file with required environment variables
# You'll need to get an API key from Fun.xyz
echo "REACT_APP_API_KEY=your_api_key_here" > .env

# Start the development server
npm start
```

## 📚 Project Structure

```
src/
├── components/
│   ├── TokenSelector/
│   │   └── TokenSelector.tsx
│   ├── SwapPreview/
│   │   └── SwapPreview.tsx
│   ├── USDInput/
│   │   └── USDInput.tsx
│   └── TokenSwap/
│       └── TokenSwap.tsx
├── types/
│   └── tokens.ts
├── utils/
│   └── api.ts
├── App.tsx
└── index.tsx
```

## 🛡️ Environment Variables

This project uses environment variables for storing sensitive information like API keys. Make sure to:

1. Create a `.env` file locally for development
2. Add your environment variables to your Vercel project settings
3. **Never commit your .env file to GitHub**

## 🔮 Future Improvements

- Add more tokens from different blockchains
- Implement token search functionality
- Add transaction history
- Support for connecting real wallets
- Dark mode toggle
- Implement actual swap functionality
- Add price charts and token analytics

---

*This project was created as a product engineering take-home assessment for Fun.xyz.*