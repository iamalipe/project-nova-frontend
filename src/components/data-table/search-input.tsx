"use client";

import { useId, useState } from "react";

import { LoaderCircleIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void | Promise<void>;
  className?: string;
};
const SearchInput = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState(value || "");
  const [isLoading, setIsLoading] = useState(false);

  const id = useId();

  useDebounce(
    () => {
      if (!onChange) return;
      setIsLoading(true);
      const result = onChange(searchValue.trim());
      if (result instanceof Promise) {
        result.finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    },
    [searchValue],
    1000,
    true
  );

  return (
    <div className={cn(["relative", className])}>
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon className="size-4" />
        <span className="sr-only">Search</span>
      </div>
      <Input
        data-testid="search-input"
        id={id}
        type="search"
        placeholder={placeholder}
        value={searchValue || ""}
        onChange={(e) => setSearchValue(e.target.value)}
        className="peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
      />
      {isLoading && (
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
          <LoaderCircleIcon className="size-4 animate-spin" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
