import React, { useState, useEffect } from "react";
import { Token } from "../../types/tokens";
import { fetchAllTokens } from "../../utils/api";
import TokenSelector from "../TokenSelector";
import USDInput from "../USDInput";
import SwapPreview from "../SwapPreview";


const TokenSwap = () => {
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [sourceToken, setSourceToken] = useState<Token | null>(null);
  const [targetToken, setTargetToken] = useState<Token | null>(null);
  const [usdAmount, setUsdAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        setLoading(true);
        const tokens = await fetchAllTokens();

        if (tokens.length === 0) {
          setError("No tokens available. Please try again later.");
          return;
        }
        setAllTokens(tokens);
        setError(null);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setError("Failed to load tokens. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadTokens();
  }, []);

  //Reset target token when source changes
  useEffect(() => {
    if (sourceToken) {
      setTargetToken(null);
    }
  }, [sourceToken]);

  const handleSourceTokenChange = (token: Token | null) => {
    setSourceToken(token);
  };

  const handleTargetTokenChange = (token: Token | null) => {
    setTargetToken(token);
  };

  const handleUSDAmountChange = (amount: number) => {
    setUsdAmount(amount);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Please try refreshing the page or check your network connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-4">Token Swap Preview</h2>
        </div>
        <div className="card-body">
          {/* Source Token Selector */}
          <TokenSelector
            label="Select Source Token"
            tokens={allTokens}
            selectedToken={sourceToken}
            onChange={handleSourceTokenChange}
          />

          {/*Show target selector only after source is selected */}
          {sourceToken && (
            <TokenSelector
              label="Select Target Token"
              tokens={allTokens}
              selectedToken={targetToken}
              excludeToken={sourceToken}
              onChange={handleTargetTokenChange}
            />
          )}

          {/* USD Input */}
          <USDInput value={usdAmount} onChange={handleUSDAmountChange} />

          {/* Swap Preview */}
          {sourceToken && targetToken && usdAmount > 0 && (
            <SwapPreview
              sourceToken={sourceToken}
              targetToken={targetToken}
              usdAmount={usdAmount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;
