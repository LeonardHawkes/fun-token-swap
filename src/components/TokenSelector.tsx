import React from "react";
import { Token } from "../types/tokens";

type TokenSelectorProps = {
    label: string;
    tokens: Token[];
    selectedToken: Token | null;
    excludeToken?: Token | null;
    onChange: (token: Token | null) => void;
}

const TokenSelector = (props: TokenSelectorProps) => {
    const {label, tokens, selectedToken, excludeToken, onChange} = props;

    const filteredTokens = excludeToken ? tokens.filter((t) => t.symbol !== excludeToken.symbol) : tokens;

    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <select
                className="form-select"
                value={selectedToken?.symbol || ""}
                onChange={(e) => {
                    const selected = tokens.find((t) => t.symbol === e.target.value);
                    onChange(selected || null);
                }}
            >
                <option value="">Select Token...</option>
                {filteredTokens.map((token) => (
                    <option key={`${token.symbol}-${token.chainId}`} value={token.symbol}>
                        {token.symbol} {token.name ? `- ${token.name}` : ''}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TokenSelector;