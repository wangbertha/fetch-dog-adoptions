import { useState } from "react";
import dogs from "../../test-data/dogs";
import DogCard from "./DogCard";

import "./../../css/DogSearch.css";

const DogsSearch = () => {
  const [isOpenFilters, setIsOpenFilters] = useState(false);

  interface FilterProps {
    name: string;
    property: string;
    values?: Array<string>;
  }

  // Parse available values for each filter category
  const filters = [
    { name: "Breed", property: "breed", values: [] },
    { name: "Age", property: "age", values: [] },
    { name: "Zip Code", property: "zip_code", values: [] },
  ];

  filters.forEach(
    (filter: FilterProps) =>
      (filter.values = [...new Set(dogs.map((dog) => dog[filter.property]))])
  );

  return (
    <>
      <h2>Step 1: Search</h2>
      <div className="dogs-search-instructions">
        <p>
          Search dogs below, and add them to your favorites if you would like to
          be matched with them.
        </p>
        <p>
          Once you have finished looking over the available dogs, click "Ready
          to be Matched!".
        </p>
      </div>
      <div className="dogs-search">
        <div className="filters">
          <button
            className="filters-toggle"
            onClick={() => setIsOpenFilters(!isOpenFilters)}
          >
            Filters
          </button>
          {isOpenFilters && (
            <div>
              <p>(Hold "Shift" to select multiple options)</p>
              <div className="filters-wrapper">
                {filters.map((filter) => (
                  <div className="filter">
                    {filter.name}
                    <select multiple>
                      {filter.values.map((value) => (
                        <option value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button>Search</button>
        </div>
        <div className="dogs-wrapper">
          {dogs.map((dog) => (
            <DogCard
              key={dog.id}
              id={dog.id}
              name={dog.name}
              breed={dog.breed}
              age={dog.age}
              zip_code={dog.zip_code}
              img={dog.img}
            />
          ))}
        </div>
        <div>
          <h3>Favorites</h3>
        </div>
      </div>
    </>
  );
};

export default DogsSearch;
