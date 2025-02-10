import "./../../css/DogCard.css";

export interface DogProps {
  id: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
  img: string;
}

export interface DogCardProps extends DogProps {
  addMode: boolean;
  updateFavoriteDogs: (addMode: boolean, dog: DogProps) => void;
}

/**
 * Tile-like card that displays a dog's information;
 * Button available to add or remove dog to Favorites
 */
const DogCard = ({
  id,
  name,
  breed,
  age,
  zip_code,
  img,
  addMode,
  updateFavoriteDogs,
}: DogCardProps) => {
  return (
    <article className="dog-card">
      <div className="dog-card-left">
        <div className="dog-name">{name}</div>
        <div>
          <span>Breed:</span> {breed}
        </div>
        <div>
          <span>Age:</span> {age}
        </div>
        <div>
          <span>Zip Code:</span> {zip_code}
        </div>
      </div>
      <div className="dog-card-right">
        <img width={144} height={144} src={img} alt="Dog" />
        <button
          onClick={() =>
            updateFavoriteDogs(addMode, { id, name, breed, age, zip_code, img })
          }
        >
          {addMode ? "Add to Favorites" : "Remove from Favorites"}
        </button>
      </div>
    </article>
  );
};

export default DogCard;
