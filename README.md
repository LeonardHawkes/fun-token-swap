# 🪙 Fun.xyz Token Swap Interface

This is a take-home project for the Product Engineer role at **Fun.xyz**. The goal is to create a simple React web application that allows users to explore token values by selecting two tokens (source and target) and entering a USD amount to see their respective values.

## 🚀 Project Overview

The application lets users:
- Select two crypto tokens (e.g., USDC and ETH)
- Enter a USD amount
- View the equivalent value of that USD amount in both tokens

This interface simulates a basic token swap preview tool — commonly found on decentralized finance (DeFi) platforms.

---

## 🛠️ Technologies Used

- **React** with **TypeScript**
- `@funkit/api-base` package for token metadata and price information
- **Netlify** for deployment

---

## 🗺️ Planned Features

- [ ] Fetch and maintain a list of supported tokens (USDC, ETH, USDT, WBTC)
- [ ] Allow users to select a source and target token
- [ ] USD amount input field
- [ ] Fetch token metadata and price info using Fun.xyz's API
- [ ] Calculate and display token amounts for both selections
- [ ] Handle loading and error states gracefully
- [ ] Responsive and accessible UI

---

## 📦 API Details

Using `@funkit/api-base`:

```ts
getAssetErc20ByChainAndSymbol({ chainId, symbol, apiKey })
getAssetPriceInfo({ chainId, assetTokenAddress, apiKey })
