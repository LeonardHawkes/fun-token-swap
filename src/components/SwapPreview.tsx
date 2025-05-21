import React from "react";
import { Token } from "../types/tokens";

type SwapPreviewProps = {
    sourceToken: Token;
    targetToken: Token;
    usdAmount: number;
}

const SwapPreview = (props: SwapPreviewProps) => {
    const {sourceToken, targetToken, usdAmount} = props;

    const formatNumberWithCommas = (num: number | string): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const calculateTokenAmount = (amount: number, price: number) => {
        return (amount / price).toFixed(6);
    };

    const calculateExchangeRate = () => {
        return (sourceToken.priceInUSD / targetToken.priceInUSD).toFixed(6);
    };

    //Format USD value with commas and 2 decimal places
    const formatUSD = (amount: number) => {
        return formatNumberWithCommas(amount.toFixed(2));
    };

    const formatTokenPrice = (price: number) => {
        return formatNumberWithCommas(price.toFixed(6));
    };


    return (
        <div className="card mt-4">
            <div className="card-header bg-info text-white">
                <h5 className="mb-0">Swap Preview</h5>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="card h-100">
                            <div className="card-header">Source Token</div>
                            <div className="card-body">
                                <h5 className="card-title">{sourceToken.symbol}</h5>
                                <p className="card-text">
                                    <strong>Amount:</strong> {calculateTokenAmount(usdAmount, sourceToken.priceInUSD)}{" "}
                                    {sourceToken.symbol}
                                </p>
                                <p className="card-text">
                                    <strong>Value:</strong> ${formatUSD(usdAmount)} USD
                                </p>
                                <p className="card-text">
                                    <strong>Price:</strong> ${formatTokenPrice(sourceToken.priceInUSD)} USD
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card h-100">
                            <div className="card-header">Target Token</div>
                            <div className="card-body">
                                <h5 className="card-title">{targetToken.symbol}</h5>
                                <p className="card-text">
                                    <strong>Amount:</strong> {calculateTokenAmount(usdAmount, targetToken.priceInUSD)}{" "}
                                    {targetToken.symbol}
                                </p>
                                <p className="card-text">
                                    <strong>Value:</strong> ${formatUSD(usdAmount)} USD
                                </p>
                                <p className="card-text">
                                    <strong>Price:</strong> ${formatTokenPrice(targetToken.priceInUSD)} USD
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-3">
                    <p className="mb-0">
                        <strong>Exchange Rate:</strong> 1 {sourceToken.symbol} = {calculateExchangeRate()}{" "}
                        {targetToken.symbol}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SwapPreview;