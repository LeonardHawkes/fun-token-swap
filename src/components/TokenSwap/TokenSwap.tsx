import React, { useState, useEffect, useRef } from "react";
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

  const isSwapping = useRef(false);

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

  //Reset target token when source changes, but ONLY if not in a swap operation
  useEffect(() => {
    if (sourceToken && !isSwapping.current) {
      setTargetToken(null);
    }
    //Reset the swap flag at the end of the effect
    isSwapping.current = false;
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

  const handleSwapTokens = () => {
    if(sourceToken && targetToken) {
        isSwapping.current = true;
        //Save the original sourceToken to a temp variable
        const temp = sourceToken;
        setSourceToken(targetToken);
        setTargetToken(temp);
    }
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

          {/* Swap Button - Only Show when both tokens are selected*/}
          {sourceToken && targetToken && (
            <div className="d-flex justify-content-center my-3">
                <button
                    className="btn btn-outline-primary rounded-circle p-2"
                    onClick={handleSwapTokens}
                    title="Swap Tokens"
                    style={{width: '48px', height: '48px'}}
                >
                    {/* Custom Swap Icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 17h16" />
                        <path d="M10 10l-4 7"/>
                        <path d="M10 10l4 7"/>
                        <path d="M20 7H4"/>
                        <path d="M14 14l4-7"/>
                        <path d="M14 14l-4-7"/>
                    </svg>
                </button>
            </div>
          )}

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
