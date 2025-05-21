import React, {useState, useEffect} from "react";

type USDInputProps = {
    value: number;
    onChange: (value: number) => void;
}
const USDInput = (props: USDInputProps) => {
    const {value, onChange} = props;
    const [displayValue, setDisplayValue] = useState<string>("");

    const formatNumberWithCommas = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    useEffect(() => {
        if(value) {
            setDisplayValue(formatNumberWithCommas(value));
        } else {
            setDisplayValue("");
        }
    }, [value]);

    //Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        //Remove any non-numeric characters except decimal points
        const numericValue = rawValue.replace(/[^0-9.]/g, "");

        if(numericValue === '') {
            setDisplayValue('');
            onChange(0);
            return;
        }

        //parse to number
        const numberValue = parseFloat(numericValue);

        if(!isNaN(numberValue)) {
            //Format with commas for display
            setDisplayValue(formatNumberWithCommas(numberValue));
            //Send the raw number to parent
            onChange(numberValue);
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label">USD Amount:</label>
            <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                    className="form-control"
                    type="text"
                    placeholder="Enter USD Amount"
                    value={displayValue}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
};

export default USDInput;