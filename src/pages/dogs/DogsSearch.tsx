import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DogCard, { DogProps } from "./DogCard";
import DogQueryForm from "./DogQueryForm";

import "./../../css/DogSearch.css";

interface QueryProps {
  breeds?: Array<string>;
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
  const navigate = useNavigate();

  // Fetched Data
  const [dogs, setDogs] = useState<Array<DogProps>>([]);

  // Filter-Related States
  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const [queries, setQueries] = useState<QueryProps>({ sort: "breed:asc" });
  // Search Results
  const [searchIssue, setSearchIssue] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);

  // Favorited Dogs and Match Error Message
  const [favoriteDogs, setFavoriteDogs] = useState<Array<DogProps>>([]);
  const [matchError, setMatchError] = useState<string>("");

  /**
   * Fetches dogs to display in "DogCard" format
   * @param type Type of query; "reset" | "prev" | "next";
   * Ex. if user needs to reset the filters or navigate pagination
   */
  const fetchDogs = async (type?: string) => {
    setSearchIssue(false);
    try {
      // Fetch Dog Search: Dog Ids
      let url = import.meta.env.VITE_BASE_URL;
      if (type === "reset") {
        url += "/dogs/search?sort=breed:asc";
      } else if (type === "prev" && prev) {
        url += prev;
      } else if (type === "next" && next) {
        url += next;
      } else {
        url += "/dogs/search?";
        const keys = Object.keys(queries);
        const values = Object.values(queries);
        for (let i = 0; i < keys.length; i++) {
          if (i !== 0) {
            url += "&";
          }
          const value = values[i];
          if (Array.isArray(value)) {
            for (let j = 0; j < value.length; j++) {
              if (j !== 0) {
                url += "&";
              }
              url += keys[i] + "=" + value[j];
            }
          } else {
            url += keys[i] + "=" + value;
          }
        }
      }

      // Fetch Dog information based on Dog Ids
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
      setTotalResults(jsonSearch.total);
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
      if (error instanceof Error) {
        if (+error.message.substring(error.message.length - 3) === 401) {
          navigate(`/login?redirect=${error}`);
        } else {
          setSearchIssue(true);
        }
      }
    }
  };

  /**
   * Updates stored queries (Does not fetch dogs with updated queries)
   * @param property Query property
   * @param value New query value
   */
  const updateQueries = (property: string, value: string) => {
    if (property === "reset") {
      setQueries({ sort: "breed:asc" });
      fetchDogs("reset");
    } else if (property === "age") {
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
      if (error instanceof Error) {
        setMatchError(error.message);
      }
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

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
              type="button"
              className="filters-toggle"
              onClick={() => setIsOpenFilters(!isOpenFilters)}
            >
              Filters (click to toggle open/close)
            </button>
            {isOpenFilters && (
              <DogQueryForm
                updateQueries={updateQueries}
                fetchDogs={fetchDogs}
              />
            )}
          </div>
          {searchIssue && (
            <p>
              There was an issue querying your search. Click "Reset", and try
              reducing the scope of your search.
            </p>
          )}
          <p>Number of results: {totalResults}</p>
          {/* Display of dogs to browse, displayed in DogCard format */}
          <div className="dogs-wrapper">
            {dogs.length === 0 && <p>Dogs are loading...</p>}
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
