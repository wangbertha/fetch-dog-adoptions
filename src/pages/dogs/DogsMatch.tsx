import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const DogsMatch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dog, setDog] = useState({});
  const id = searchParams.get("id");

  const fetchDog = async () => {
    const response = await fetch(import.meta.env.VITE_BASE_URL + "/dogs", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([id]),
      credentials: "include",
    });
    const json = await response.json();
    setDog(json[0]);
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
