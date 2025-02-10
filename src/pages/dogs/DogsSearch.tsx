import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DogCard, { DogProps } from "./DogCard";
import MultiRangeSlider from "../../components/MultiRangeSlider/MultiRangeSlider";

import "./../../css/DogSearch.css";

interface QueryProps {
  breeds?: Array<string>;
  zipCodes?: Array<string>;
  ageMin?: number;
  ageMax?: number;
  sort: string;
}

/**
 * Child component to "Dogs" that displays dogs and favorited dogs;
 * Includes functionality to add/remove dogs to favorites;
 * Includes functionality to filter dogs shown
 */
const DogsSearch = () => {
  const [dogs, setDogs] = useState<Array<DogProps>>([]);
  const [breeds, setBreeds] = useState<Array<string>>([]);
  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const [favoriteDogs, setFavoriteDogs] = useState<Array<DogProps>>([]);
  const [queries, setQueries] = useState<QueryProps>({ sort: "breed:asc" });
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [matchError, setMatchError] = useState<string>("");

  const navigate = useNavigate();

  /**
   * Fetches dogs to display in "DogCard" format
   * @param type Type of query; "reset" | "prev" | "next";
   * Ex. if user needs to reset the filters or navigate pagination
   */
  const fetchDogs = async (type?: string) => {
    try {
      const url = new URL(import.meta.env.VITE_BASE_URL + "/dogs/search");
      if (type === "reset") {
        url.search = new URLSearchParams({ sort: "breed:asc" }).toString();
      } else if (type === "prev" && prev) {
        url.search = new URLSearchParams(prev).toString();
      } else if (type === "next" && next) {
        url.search = new URLSearchParams(next).toString();
      } else {
        url.search = new URLSearchParams(queries).toString();
      }

      const responseSearch = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!responseSearch.ok) {
        throw new Error(`Response status: ${responseSearch.status}`);
      }
      const jsonSearch = await responseSearch.json();
      const ids = jsonSearch.resultIds;
      setPrev(jsonSearch.prev);
      setNext(jsonSearch.next);

      const responseDogs = await fetch(
        import.meta.env.VITE_BASE_URL + "/dogs",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ids),
          credentials: "include",
        }
      );
      if (!responseDogs.ok) {
        throw new Error(`Response status: ${responseDogs.status}`);
      }
      const jsonDogs = await responseDogs.json();
      setDogs(jsonDogs);
    } catch (error) {
      navigate(`/login?redirect=${error}`);
    }
  };

  /**
   * Fetches all breeds of available dogs
   */
  const fetchBreeds = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/dogs/breeds",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setBreeds(json);
    } catch (error) {
      navigate(`/login?redirect=${error}`);
    }
  };

  useEffect(() => {
    fetchDogs();
    fetchBreeds();
  }, []);

  // Parse available values for each filter category
  const filters = [
    { name: "Breed", property: "breed", query: "breeds", values: [] },
    { name: "Age", property: "age", query: "age", values: [] },
    {
      name: "Zip Code",
      property: "zip_code",
      query: "zipCodes",
      values: [...new Set(dogs.map((dog) => dog.zip_code))],
    },
  ];

  /**
   * Updates stored queries (Does not fetch dogs with updated queries)
   * @param property Query property
   * @param value New query value
   */
  const updateQueries = (property: string, value: string) => {
    if (property === "age") {
      const [min, max] = value.split("/");
      setQueries({ ...queries, ageMin: +min, ageMax: +max });
    } else if (property === "sort") {
      let [field, direction] = queries.sort.split(":");
      if (value === "asc" || value === "desc") {
        direction = value;
      } else {
        field = value;
      }
      setQueries({ ...queries, sort: [field, direction].join(":") });
    } else {
      setQueries({ ...queries, [property]: value.split(",") });
    }
  };

  /**
   * Adds or removes a dog to/from Favorited Dogs
   * @param addMode Boolean to determine whether dog is added or removed; true | false
   * @param dog Object containing dog information
   */
  const updateFavoriteDogs = (addMode: boolean, dog: DogProps) => {
    if (addMode) {
      if (!favoriteDogs.find((favoriteDog) => favoriteDog.id === dog.id)) {
        setFavoriteDogs(
          [...favoriteDogs, dog].sort((dog1: DogProps, dog2: DogProps) =>
            dog1.breed.localeCompare(dog2.breed)
          )
        );
      }
    } else {
      setFavoriteDogs(
        favoriteDogs.filter((favoriteDog) => favoriteDog.id !== dog.id)
      );
    }
  };

  /**
   * Fetches a dog match based on Favorited Dogs;
   * If successful, navigate to the "/dogs/match" page with matched dog
   */
  const findMatch = async () => {
    if (favoriteDogs.length === 0) {
      setMatchError("Select a few favorites in order to find your match.");
      return;
    }
    const favoriteDogIds = favoriteDogs.map((dog) => dog.id);
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/dogs/match",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(favoriteDogIds),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const favoriteDogId = await response.json();
      if (Object.keys(favoriteDogId).length === 0) {
        throw new Error(
          "There was an error selecting your match! Try giving it another shot."
        );
      }
      navigate(`/dogs/match?id=${favoriteDogId.match}`);
    } catch (error) {
      setMatchError(error.message);
    }
  };

  return (
    <>
      <a href="/dogs/search#favorites" className="anchor-btn">
        <button>View Favorites</button>
      </a>
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
      <div className="dogs-search-wrapper">
        <div className="dogs-search">
          {/* Filters for Dog Search */}
          <div className="filters">
            <button
              className="filters-toggle"
              onClick={() => setIsOpenFilters(!isOpenFilters)}
            >
              Filters (click to toggle open/close)
            </button>
            {isOpenFilters && (
              <>
                <div>
                  <p>(Hold "Ctrl" or "Shift" to select multiple options)</p>
                  <div className="filters-wrapper">
                    {filters.map((filter, i) => (
                      <div key={i} className="filter">
                        {filter.name}
                        {filter.property === "age" ? (
                          <MultiRangeSlider
                            min={0}
                            max={20}
                            onChange={({
                              min,
                              max,
                            }: {
                              min: number;
                              max: number;
                            }) => {
                              updateQueries(
                                "age",
                                min.toString() + "/" + max.toString()
                              );
                            }}
                          />
                        ) : filter.property === "breed" ? (
                          <select
                            onChange={(e) => {
                              const values = [...e.target.selectedOptions].map(
                                (value) => value.value
                              );
                              updateQueries("breed", values.toString());
                            }}
                            multiple
                          >
                            {breeds.map((value, i) => (
                              <option key={i} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            onChange={(e) => {
                              const values = [...e.target.selectedOptions].map(
                                (value) => value.value
                              );
                              updateQueries(filter.query, values.toString());
                            }}
                            multiple
                          >
                            {filter.values.map((value, i) => (
                              <option key={i} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                    <div className="filter">
                      Sort By:
                      <select
                        onChange={(e) => updateQueries("sort", e.target.value)}
                      >
                        {filters.map((filter, i) => (
                          <option key={i} value={filter.property}>
                            {filter.name}
                          </option>
                        ))}
                      </select>
                      <p className="note">Direction</p>
                      <select
                        onChange={(e) => updateQueries("sort", e.target.value)}
                      >
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                      </select>
                    </div>
                  </div>
                </div>
                <p>
                  Note: Zip Code filter options shown are many but not all
                  available zip codes. Try searching first by breed and age.
                </p>
                <div className="btn-wrapper">
                  <button onClick={() => fetchDogs()}>Search</button>
                  <button
                    onClick={() => {
                      setQueries({ sort: "breed:asc" });
                      fetchDogs("reset");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
          {/* Display of dogs to browse, displayed in DogCard format */}
          <div className="dogs-wrapper">
            {dogs.length === 0 && <p>Dogs loading...</p>}
            {dogs.map((dog) => (
              <DogCard
                key={dog.id}
                addMode={true}
                updateFavoriteDogs={updateFavoriteDogs}
                id={dog.id}
                name={dog.name}
                breed={dog.breed}
                age={dog.age}
                zip_code={dog.zip_code}
                img={dog.img}
              />
            ))}
          </div>
          {/* Buttons to navigate paginated results */}
          <div className="btn-wrapper">
            {prev && (
              <button onClick={() => fetchDogs("prev")}>Previous</button>
            )}
            {next && <button onClick={() => fetchDogs("next")}>Next</button>}
          </div>
        </div>
        {/* Display of Favorited Dogs, displayed in DogCard format */}
        <div className="favorite-dogs">
          <h3 id="favorites" className="favorite-dogs-header">
            Favorites
          </h3>
          {favoriteDogs.length === 0 ? (
            <p>You do not currently have any favorites selected.</p>
          ) : (
            <>
              <div className="dogs-wrapper">
                {favoriteDogs.map((dog) => (
                  <DogCard
                    key={dog.id}
                    addMode={false}
                    updateFavoriteDogs={updateFavoriteDogs}
                    id={dog.id}
                    name={dog.name}
                    breed={dog.breed}
                    age={dog.age}
                    zip_code={dog.zip_code}
                    img={dog.img}
                  />
                ))}
              </div>
              <button onClick={findMatch}>Find Your Match!</button>
              <p>{matchError}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DogsSearch;
