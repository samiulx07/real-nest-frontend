"use client";

import React from "react";
import CreatableSelect from "react-select/creatable";

interface CreatableNumberSelectProps {
  value: number | string;
  onChange: (val: number) => void;
  placeholder?: string;
  maxPredefined?: number;
  icon?: React.ReactNode;
}

export const CreatableNumberSelect: React.FC<CreatableNumberSelectProps> = ({
  value,
  onChange,
  placeholder = "Select or type number...",
  maxPredefined = 50,
  icon,
}) => {
  // Generate options 1 to 50
  const options = Array.from({ length: maxPredefined }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));

  const selectedOption = value
    ? { value: Number(value), label: `${value}` }
    : null;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {icon && <div className="text-[#FF4C00] shrink-0 text-base">{icon}</div>}
        <div className="flex-1">
          <CreatableSelect
            value={selectedOption}
            onChange={(newValue: any) => {
              if (newValue) {
                const num = Number(newValue.value);
                onChange(isNaN(num) ? 0 : num);
              } else {
                onChange(0);
              }
            }}
            options={options}
            placeholder={placeholder}
            isClearable
            isSearchable
            className="text-xs font-bold"
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: "0.75rem",
                borderColor: state.isFocused ? "#FF4C00" : "#E2E8F0",
                boxShadow: state.isFocused ? "0 0 0 1px #FF4C00" : "none",
                "&:hover": {
                  borderColor: "#FF4C00",
                },
                padding: "2px",
                fontSize: "0.75rem",
                fontWeight: "700",
                color: "#00062A",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#FF4C00"
                  : state.isFocused
                  ? "#FFF2EC"
                  : "white",
                color: state.isSelected ? "white" : "#00062A",
                fontSize: "0.75rem",
                fontWeight: "700",
                cursor: "pointer",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#00062A",
                fontWeight: "800",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "0.75rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                zIndex: 9999,
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatableNumberSelect;
