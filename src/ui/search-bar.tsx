import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import { Input } from "@treyza/sdk/ui/input";
import { navigate } from "@treyza/sdk/actions";

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

function SearchBar({ placeholder = "Urun ara...", onSearch, className, ...props }: SearchBarProps) {
  const [query, setQuery] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) onSearch(query.trim());
    else navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
      </form>
    </div>
  );
}

export { SearchBar };
export type { SearchBarProps };
