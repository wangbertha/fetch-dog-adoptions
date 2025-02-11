import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MultiRangeSlider from "../../components/MultiRangeSlider/MultiRangeSlider";

import "../../css/DogQueryForm.css";

interface DogQueryFormProps {
  updateQueries: (property: string, value: string) => void;
  fetchDogs: (type?: string) => void;
}

const DogQueryForm = ({ updateQueries, fetchDogs }: DogQueryFormProps) => {
  const navigate = useNavigate();
  const [breeds, setBreeds] = useState<Array<string>>([]);
  // Age-Range Input
  const minValInit = 0;
  const maxValInit = 20;
  const [minVal, setMinVal] = useState<number>(minValInit);
  const [maxVal, setMaxVal] = useState<number>(maxValInit);

  // Parse available values for each filter category
  const filters = [
    { name: "Breed", property: "breed" },
    { name: "Age", property: "age" },
  ];

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
    fetchBreeds();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fetchDogs();
      }}
    >
      <p>(Hold "Ctrl" or "Shift" to select multiple options)</p>
      <div className="filters-wrapper">
        <label className="filter">
          Breed
          <select
            onChange={(e) => {
              const values = [...e.target.selectedOptions].map(
                (value) => value.value
              );
              updateQueries("breeds", values.toString());
            }}
            multiple
          >
            {breeds.map((value, i) => (
              <option key={i} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="filter">
          Age
          <MultiRangeSlider
            min={minValInit}
            max={maxValInit}
            minVal={minVal}
            maxVal={maxVal}
            setMinVal={setMinVal}
            setMaxVal={setMaxVal}
            onChange={({ min, max }: { min: number; max: number }) => {
              updateQueries("age", min.toString() + "/" + max.toString());
            }}
          />
        </label>
        <div className="filter">
          Sort By:
          <select onChange={(e) => updateQueries("sort", e.target.value)}>
            {filters.map((filter, i) => (
              <option key={i} value={filter.property}>
                {filter.name}
              </option>
            ))}
          </select>
          <p className="note">Direction</p>
          <select onChange={(e) => updateQueries("sort", e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
      {/* Buttons to submit search query */}
      <div className="btn-wrapper">
        <button type="submit">Search</button>
        <button
          type="reset"
          onClick={() => {
            updateQueries("reset", "reset");
            setMinVal(0);
            setMaxVal(20);
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default DogQueryForm;
