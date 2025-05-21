import { 
    getAssetErc20ByChainAndSymbol,
    getAssetPriceInfo
} from '@funkit/api-base';
import { Token } from '../types/tokens';

const API_KEY = process.env.REACT_APP_API_KEY;

const FALLBACK_API_KEY = '';

if(!API_KEY && !FALLBACK_API_KEY) {
    console.warn('No API key found. Please set REACT_APP_API_KEY in your .env file.');
}

//Feature flagging
const TOKEN_FEATURES = {
    ENABLE_ADDITIONAL_TOKENS: true, //Master switch
    ENABLE_LINK: true,
    ENABLE_UNI: true,
    ENABLE_DOGE: true
};

const coreTokens = [
    {symbol: "USDC", chainId: "1", name:"USD Coin"},
    {symbol: "USDT", chainId: "137", name: "Tether USD"},
    {symbol: "ETH", chainId: "8453", name: "Ethereum"},
    {symbol: "WBTC", chainId: "1", name: "Wrapped Bitcoin"},
];

const additionalTokens = [
    ...(TOKEN_FEATURES.ENABLE_LINK && TOKEN_FEATURES.ENABLE_ADDITIONAL_TOKENS ? 
        [{symbol: "LINK", chainId: "1", name: "Chainlink"}] : []),
    ...(TOKEN_FEATURES.ENABLE_UNI && TOKEN_FEATURES.ENABLE_ADDITIONAL_TOKENS ? 
        [{symbol: "UNI", chainId: "1", name: "Uniswap"}] : []),
    ...(TOKEN_FEATURES.ENABLE_DOGE && TOKEN_FEATURES.ENABLE_ADDITIONAL_TOKENS ? 
        [{symbol: "DOGE", chainId: "1", name: "Dogecoin"}] : []),
];

const supportedTokens = [...coreTokens, ...additionalTokens];

//Set Placeholder logo urls
const logoUrls: Record<string, string> = {
    "USDC": "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
    "USDT": "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026",
    "ETH": "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
    "WBTC": "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=026",
    "LINK": "https://cryptologos.cc/logos/chainlink-link-logo.png?v=026",
    "UNI": "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=026",
    "DOGE": "https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=026",
};

const fallbackPrices: Record<string, number> = {
    "USDC": 1.0,
    "USDT": 1.0,
    "ETH": 3500.0,
    "WBTC": 65000.0,
    "LINK": 15.5,
    "UNI": 8.2,
    "DOGE": 0.12,
};

const defaultDecimalPlaces: Record<string, number> = {
    "USDC": 6,
    "USDT": 6,
    "ETH": 18,
    "WBTC": 8,
    "LINK": 18,
    "UNI": 18,
    "DOGE": 8,
};

const fetchSingleToken = async (
    symbol: string,
    chainId: string,
    name?: string
): Promise<Token | null> => {
    try {
        //Use the actual API key or fallback
        const apiKey = API_KEY || FALLBACK_API_KEY;

        if(!apiKey) {
            throw new Error('API key is required but not provided.');
        }
        //Get token metadata
        const metadata = await getAssetErc20ByChainAndSymbol({
            chainId,
            symbol,
            apiKey,
        });

        //get token price
        const price = await getAssetPriceInfo({
            chainId,
            assetTokenAddress: metadata.address,
            apiKey,
        });

        //return combined token data

        return {
            symbol,
            name: name || metadata.name,
            chainId,
            tokenAddress: metadata.address,
            priceInUSD: price.unitPrice,
            logoUrl: logoUrls[symbol],
            decimals: metadata.decimals || defaultDecimalPlaces[symbol] || 18,
        };
    } catch(error) {
        console.error(`Error fetching ${symbol} on chain ${chainId}`, error);

        //Fallback prices if API fails
        if(fallbackPrices[symbol]) {
            return {
                symbol,
                name: name || symbol,
                chainId,
                tokenAddress: "0x" + "0".repeat(40),
                priceInUSD: fallbackPrices[symbol],
                logoUrl: logoUrls[symbol],
                decimals: defaultDecimalPlaces[symbol] || 18,
            };
        }
        return null;
    }
};
/**
 * Fetches all supported tokens with their metadata and prices
 */

export const fetchAllTokens = async (): Promise<Token[]> => {
    try {
        //Create promises for all tokens
        const tokenPromises = supportedTokens.map(({symbol, chainId, name}) => (
            fetchSingleToken(symbol, chainId, name)
        ));

        //Fetch all tokens in parallel
        const results = await Promise.all(tokenPromises);

        //Filter out failed token fetches
        const validTokens = results.filter((token): token is Token => token !== null);

        //Sort tokens alphabetically by symbol
        return validTokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
    } catch(error) {
        console.error("Error fetching all tokens: ", error);
        return [];
    }
};

/**
 * Refreshes price data for specified tokens
 */

export const refreshTokenPrices = async (tokens:Token[]): Promise<Token[]> => {
    try {
        const refreshPromises = tokens.map(async (token) => {
            try {
                // Use the actual API key or fallback
                const apiKey = API_KEY || FALLBACK_API_KEY;
                
                if (!apiKey) {
                    throw new Error('API key is required but not provided.');
                }
                const price = await getAssetPriceInfo({
                    chainId: token.chainId,
                    assetTokenAddress: token.tokenAddress,
                    apiKey,
                });

                return {
                    ...token,
                    priceInUSD: price.unitPrice,
                };
            } catch(error) {
                console.error(`Error refreshing ${token.symbol} price:`, error);
                return token;
            }
        });

        return await Promise.all(refreshPromises);
    } catch(error) {
        console.error("Error refreshing token prices:", error);
        return tokens;
    }
    
}
