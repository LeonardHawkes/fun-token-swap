import { 
    getAssetErc20ByChainAndSymbol,
    getAssetPriceInfo
} from '@funkit/api-base';
import { Token } from '../types/tokens';

const API_KEY = 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk';

const supportedTokens: {symbol: string; chainId: string}[] = [
    {symbol: "USDC", chainId: "1"},
    {symbol: "USDT", chainId: "137"},
    {symbol: "ETH", chainId: "8453"},
    {symbol: "WBTC", chainId: "1"},
];

const fetchSingleToken = async (
    symbol: string,
    chainId: string
): Promise<Token | null> => {
    try {
        const metadata = await getAssetErc20ByChainAndSymbol({
            chainId,
            symbol,
            apiKey: API_KEY,
        });

        const price = await getAssetPriceInfo({
            chainId,
            assetTokenAddress: metadata.address,
            apiKey: API_KEY,
        });

        return {
            symbol,
            name: metadata.name,
            chainId,
            tokenAddress: metadata.address,
            priceInUSD: price.unitPrice,
        };
    } catch(error) {
        console.error(`Error fetching ${symbol} on chain ${chainId}`, error);
        return null;
    }
};

export const fetchAllTokens = async (): Promise<Token[]> => {
    const tokenPromises = supportedTokens.map(({symbol, chainId}) => (
        fetchSingleToken(symbol, chainId)
    ));

    const results = await Promise.all(tokenPromises);
    return results.filter((token): token is Token => token != null);
};
