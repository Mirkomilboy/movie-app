import { type FC } from "react";

interface SearchProps {
  searchTerm: any
  setSearchTerm: any
}

const Search: FC<SearchProps> = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search icon" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;