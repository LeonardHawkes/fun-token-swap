import { 
    getAssetErc20ByChainAndSymbol,
    getAssetPriceInfo
} from '@funkit/api-base';
import { Token } from '../types/tokens';

const API_KEY = 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk';

const supportedTokens: {symbol: string; chainId: string; name?: string}[] = [
    {symbol: "USDC", chainId: "1", name:"USD Coin"},
    {symbol: "USDT", chainId: "137", name: "Tether USD"},
    {symbol: "ETH", chainId: "8453", name: "Ethereum"},
    {symbol: "WBTC", chainId: "1", name: "Wrapped Bitcoin"},
];

const fetchSingleToken = async (
    symbol: string,
    chainId: string,
    name?: string
): Promise<Token | null> => {
    try {
        //Get token metadata
        const metadata = await getAssetErc20ByChainAndSymbol({
            chainId,
            symbol,
            apiKey: API_KEY,
        });

        //get token price
        const price = await getAssetPriceInfo({
            chainId,
            assetTokenAddress: metadata.address,
            apiKey: API_KEY,
        });

        //return combined token data

        return {
            symbol,
            name: name || metadata.name,
            chainId,
            tokenAddress: metadata.address,
            priceInUSD: price.unitPrice,
        };
    } catch(error) {
        console.error(`Error fetching ${symbol} on chain ${chainId}`, error);
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
                const price = await getAssetPriceInfo({
                    chainId: token.chainId,
                    assetTokenAddress: token.tokenAddress,
                    apiKey: API_KEY,
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
