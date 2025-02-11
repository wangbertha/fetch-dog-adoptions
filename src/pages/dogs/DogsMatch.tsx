import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { DogProps } from "./DogCard";

import "../../css/DogMatch.css";

/**
 * Child component to "Dogs" that displays the matched dog
 */
const DogsMatch = () => {
  const navigate = useNavigate();

  // Dog Information
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [dog, setDog] = useState<DogProps | null>(null);

  /**
   * Fetch dog with the match ID provided in the URL
   */
  const fetchDog = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + "/dogs", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([id]),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setDog(json[0]);
    } catch (error) {
      navigate(`/login?redirect=${error}`);
    }
  };

  useEffect(() => {
    fetchDog();
    setSearchParams(searchParams);
  }, []);

  return (
    <>
      <a href="/dogs/search" className="anchor-btn">
        <button>Back to Search</button>
      </a>
      <h2>Step 2: Match</h2>
      <div className="dog-match">
        <div>Congratulations!</div>
        <p>
          You have been successfully matched with {dog ? dog.name : "........"}!
        </p>
        {dog && <img src={dog.img} alt="" />}
        {dog && (
          <div>
            <span className="special-text">{dog.name}</span> the {dog.breed} is{" "}
            {dog.age} years old, is currently located in the {dog.zip_code} zip
            code area, and is excited to meet you!
          </div>
        )}
      </div>
    </>
  );
};

export default DogsMatch;
