import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DogProps } from "./DogCard";

const DogsMatch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dog, setDog] = useState<DogProps | object>({});
  const id = searchParams.get("id");
  const navigate = useNavigate();

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
  }, []);

  return (
    <>
      <h2>Step 2: Match</h2>
      <div>Congratulations!</div>
      <p>You have been successfully matched with {dog.name}!</p>
      <img src={dog.img} alt="" />
    </>
  );
};

export default DogsMatch;
