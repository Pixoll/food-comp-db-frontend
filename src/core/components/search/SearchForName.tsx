import { useState } from "react";

export default function SearchForName() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="search-for-name">
      <input
        className="input-for-name"
        type="text"
        placeholder="Enter name"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
