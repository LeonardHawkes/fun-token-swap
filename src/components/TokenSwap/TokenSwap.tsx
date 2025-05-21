import React, {useState, useEffect} from "react";
import { Token } from "../../types/tokens";
import { fetchAllTokens } from "../../utils/api";

const TokenSwap = () => {
    const [allTokens, setAllTokens] = useState<Token[]>([]);
    const [sourceToken, setSourceToken] = useState<Token | null>(null);
    const [targetToken, setTargetToken] = useState<Token | null>(null);
    const [usdAmount, setUsdAmount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTokens = async () => {
            try {
                const tokens = await fetchAllTokens();
                setAllTokens(tokens);
            } catch(error) {
                console.error("Error fetching tokens:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTokens();
    }, []);

    if(loading) {
        return <div className="container mt-5">Loading tokens...</div>
    }



    return (
        <div className="container mt-5">
            <h2 className="mb-4">Token Swap Preview</h2>

            {/* Source Token Selector */}
            <div className="mb-3">
                <label className="form-label">Select Source Token:</label>
                {/*Replace with <TokenSelector /> */}
                <select
                    className="form-select"
                    value={sourceToken?.symbol || ''}
                    onChange={(e) => {
                        const selected = allTokens.find((t) => t.symbol === e.target.value);
                        setSourceToken(selected || null);
                        setTargetToken(null); //Reset target when source changes
                    }}
                >
                    <option value="">Select Token...</option>
                    {allTokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                            {token.symbol}
                        </option>
                    ))}
                </select>
            </div>

            {/*Show target selector only after source is selected */}
            {sourceToken && (
                <div className="mb-3">
                    <label className="form-label">Select Target Token:</label>
                    <select
                        className="form-select"
                        value={targetToken?.symbol || ''}
                        onChange={(e) => {
                            const selected = allTokens.find((t) => t.symbol === e.target.value);
                            setTargetToken(selected || null);
                        }}
                    >
                        <option value="">Select Token...</option>
                        {allTokens
                            .filter((t) => t.symbol !== sourceToken.symbol)
                            .map((token) => (
                                <option key={token.symbol} value={token.symbol}>
                                    {token.symbol}
                                </option>
                            ))
                        }
                    </select>
                </div>
            )}

            {/* USD Input */}
            <div className="mb-3">
                <label className="form-label">USD Amount:</label>
                {/*Replace with <USDInput /> */}
                <input
                    className="form-control"
                    type="number"
                    value={usdAmount}
                    onChange={(e)=> setUsdAmount(Number(e.target.value))}
                />
            </div>

            {/* Swap Preview */}
            {sourceToken && targetToken && usdAmount > 0 && (
                <div className="alert alert-info">
                    <p>
                        ${usdAmount} = {(usdAmount / sourceToken.priceInUSD).toFixed(4)}{" "}
                        {sourceToken.symbol}
                    </p>
                    <p>
                        ${usdAmount} = {(usdAmount / targetToken.priceInUSD).toFixed(4)}{" "}
                        {targetToken.symbol}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TokenSwap;