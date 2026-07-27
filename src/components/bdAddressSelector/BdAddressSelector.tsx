"use client";

import React, { useMemo, useCallback } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import {
  getAllDivisions,
  getDistrictsByDivision,
  getUpazilasByDistrict,
  getUnionsByUpazila,
  getDivisionByName,
  getDistrictByName,
  getUpazilaByName,
} from "bangladesh-geo-data";

const DHAKA_METRO_THANAS = [
  "Adabor",
  "Badda",
  "Banani",
  "Bangshal",
  "Bhashantek",
  "Biman Bandar",
  "Cantonment",
  "Chawkbazar",
  "Dakshinkhan",
  "Darus Salam",
  "Demra",
  "Dhanmondi",
  "Gendaria",
  "Gulshan",
  "Hazaribagh",
  "Jatrabari",
  "Kadamtali",
  "Kafrul",
  "Kalabagan",
  "Kamrangirchar",
  "Khilgaon",
  "Khilkhet",
  "Kotwali",
  "Lalbagh",
  "Mirpur",
  "Mohakhali",
  "Mohammadpur",
  "Motijheel",
  "New Market",
  "Paltan",
  "Ramna",
  "Rampura",
  "Sabujbagh",
  "Shahbagh",
  "Sher-e-Bangla Nagar",
  "Shyampur",
  "Sutrapur",
  "Tejgaon",
  "Tejgaon Industrial Area",
  "Turag",
  "Uttara",
  "Uttara East",
  "Uttara West",
  "Uttarkhan",
  "Vatara",
  "Wari",
];

const CHATTOGRAM_METRO_THANAS = [
  "Akbar Shah",
  "Bayezid Bostami",
  "Chandgaon",
  "Chawkbazar",
  "Double Mooring",
  "EPZ",
  "Halishahar",
  "Karnafuli",
  "Khulshi",
  "Kotwali",
  "Pahartali",
  "Panchlaish",
  "Patenga",
  "Sadarghat",
];

interface BdAddressValue {
  division?: string;
  district?: string;
  upazila?: string;
  union?: string;
}

interface BdAddressSelectorProps {
  value: BdAddressValue;
  onChange: (value: BdAddressValue) => void;
}

interface SelectOption {
  value: string;
  label: string;
  id: string;
}

// Custom styles for react-select to match the form design
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "10px",
    border: state.isFocused ? "1.5px solid #FF4C00" : "1.5px solid #e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(255, 76, 0, 0.1)" : "none",
    padding: "2px 4px",
    fontSize: "14px",
    minHeight: "44px",
    backgroundColor: "#fff",
    "&:hover": {
      borderColor: "#FF4C00",
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#FF4C00"
      : state.isFocused
      ? "rgba(255, 76, 0, 0.08)"
      : "#fff",
    color: state.isSelected ? "#fff" : "#1e293b",
    fontSize: "14px",
    padding: "10px 14px",
    cursor: "pointer",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "14px",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#1e293b",
    fontSize: "14px",
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.18)",
    overflow: "hidden",
    zIndex: 99999,
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 99999,
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: "200px",
  }),
};

const BdAddressSelector: React.FC<BdAddressSelectorProps> = ({ value, onChange }) => {
  const portalTarget = typeof window !== "undefined" ? document.body : undefined;

  // Division options
  const divisionOptions = useMemo<SelectOption[]>(() => {
    const list = getAllDivisions() || [];
    return list.filter(Boolean).map((d) => ({
      value: d.name,
      label: d.name,
      id: d.id,
    }));
  }, []);

  // District options — filtered by selected division
  const districtOptions = useMemo<SelectOption[]>(() => {
    if (!value.division) return [];
    const div = getDivisionByName(value.division);
    if (!div?.id) return [];
    const list = getDistrictsByDivision(div.id) || [];
    return list.filter(Boolean).map((d) => ({
      value: d.name,
      label: d.name,
      id: d.id,
    }));
  }, [value.division]);

  // Upazila / Thana options — filtered by selected district + Metro Thanas
  const upazilaOptions = useMemo<SelectOption[]>(() => {
    if (!value.district) return [];
    const dist = getDistrictByName(value.district);
    const rawList = dist?.id ? getUpazilasByDistrict(dist.id) || [] : [];
    let combinedNames = rawList.filter(Boolean).map((u) => u.name);

    if (value.district.toLowerCase() === "dhaka") {
      combinedNames = Array.from(new Set([...DHAKA_METRO_THANAS, ...combinedNames])).sort();
    } else if (
      value.district.toLowerCase() === "chittagong" ||
      value.district.toLowerCase() === "chattogram"
    ) {
      combinedNames = Array.from(new Set([...CHATTOGRAM_METRO_THANAS, ...combinedNames])).sort();
    }

    return combinedNames.map((name) => ({
      value: name,
      label: name,
      id: name,
    }));
  }, [value.district]);

  // Union options — filtered by selected upazila
  const unionOptions = useMemo<SelectOption[]>(() => {
    if (!value.upazila) return [];
    const upz = getUpazilaByName(value.upazila);
    const rawList = upz?.id ? getUnionsByUpazila(upz.id) || [] : [];
    return rawList.filter(Boolean).map((u) => ({
      value: u.name,
      label: u.name,
      id: u.id,
    }));
  }, [value.upazila]);

  const handleDivisionChange = useCallback(
    (option: SelectOption | null) => {
      onChange({
        division: option?.value || undefined,
        district: undefined,
        upazila: undefined,
        union: undefined,
      });
    },
    [onChange]
  );

  const handleDistrictChange = useCallback(
    (option: SelectOption | null) => {
      onChange({
        ...value,
        district: option?.value || undefined,
        upazila: undefined,
        union: undefined,
      });
    },
    [onChange, value]
  );

  const handleUpazilaChange = useCallback(
    (option: SelectOption | null) => {
      onChange({
        ...value,
        upazila: option?.value || undefined,
        union: undefined,
      });
    },
    [onChange, value]
  );

  const handleUnionChange = useCallback(
    (option: SelectOption | null) => {
      onChange({
        ...value,
        union: option?.value || undefined,
      });
    },
    [onChange, value]
  );

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "#475569",
  };

  return (
    <div className="bd-address-selector">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Division */}
        <div>
          <label style={labelStyle}>Division</label>
          <Select
            options={divisionOptions}
            value={divisionOptions.find((o) => o.value === value.division) || null}
            onChange={handleDivisionChange}
            placeholder="Select Division..."
            isClearable
            isSearchable
            menuPortalTarget={portalTarget}
            styles={customStyles}
          />
        </div>

        {/* District */}
        <div>
          <label style={labelStyle}>District</label>
          <Select
            options={districtOptions}
            value={districtOptions.find((o) => o.value === value.district) || null}
            onChange={handleDistrictChange}
            placeholder={value.division ? "Select District..." : "Select division first"}
            isClearable
            isSearchable
            isDisabled={!value.division}
            menuPortalTarget={portalTarget}
            styles={customStyles}
          />
        </div>

        {/* Upazila / Thana */}
        <div>
          <label style={labelStyle}>Upazila / Thana</label>
          <CreatableSelect
            options={upazilaOptions}
            value={
              value.upazila
                ? upazilaOptions.find((o) => o.value === value.upazila) || {
                    value: value.upazila,
                    label: value.upazila,
                    id: value.upazila,
                  }
                : null
            }
            onChange={handleUpazilaChange}
            placeholder={value.district ? "Select or type Upazila/Thana..." : "Select district first"}
            isClearable
            isSearchable
            isDisabled={!value.district}
            menuPortalTarget={portalTarget}
            styles={customStyles}
          />
        </div>

        {/* Union / Ward */}
        <div>
          <label style={labelStyle}>Union / Ward</label>
          <CreatableSelect
            options={unionOptions}
            value={
              value.union
                ? unionOptions.find((o) => o.value === value.union) || {
                    value: value.union,
                    label: value.union,
                    id: value.union,
                  }
                : null
            }
            onChange={handleUnionChange}
            placeholder={value.upazila ? "Select or type Union/Ward..." : "Select upazila first"}
            isClearable
            isSearchable
            isDisabled={!value.upazila}
            menuPortalTarget={portalTarget}
            styles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default BdAddressSelector;
