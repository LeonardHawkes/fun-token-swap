import React from "react";

type USDInputProps = {
    value: number;
    onChange: (value: number) => void;
}
const USDInput = (props: USDInputProps) => {
    const {value, onChange} = props;

    return (
        <div className="mb-3">
            <label className="form-label">USD Amount:</label>
            <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter USD Amount"
                    value={value || ""}
                    onChange={(e) => onChange(Number(e.target.value))}
                />
            </div>
        </div>
    );
};

export default USDInput;