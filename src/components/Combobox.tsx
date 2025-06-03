import { Combobox as HCombobox } from "@headlessui/react";
import { Fragment, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
  status?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  displayValue?: (val: string) => string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled,
  displayValue,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredOptions = query === ""
    ? options
    : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <HCombobox value={value} onChange={onChange}>
      <div className="relative">
        <div className="relative">
          <HCombobox.Input
            className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            displayValue={displayValue || ((val: string) => options.find((o) => o.value === val)?.label || "")}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => buttonRef.current?.click()}
            placeholder={placeholder}
            disabled={disabled}
          />
          <HCombobox.Button 
            ref={buttonRef}
            className="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </HCombobox.Button>
        </div>
        <HCombobox.Options className="absolute z-50 mt-1 w-full min-w-[200px] rounded-md border border-input bg-background py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-muted-foreground">No options found.</div>
          )}
          {filteredOptions.map((option) => (
            <HCombobox.Option
              key={option.value}
              value={option.value}
              className={({ active, selected }) =>
                cn(
                  "relative cursor-pointer select-none py-2 pl-3 pr-9 rounded-md",
                  active && "bg-accent text-accent-foreground",
                  selected && "font-semibold"
                )
              }
            >
              <span className="block truncate">
                {option.label}
                {option.status && (
                  <span className="ml-2 text-xs text-green-600 font-medium">{option.status}</span>
                )}
              </span>
            </HCombobox.Option>
          ))}
        </HCombobox.Options>
      </div>
    </HCombobox>
  );
} 