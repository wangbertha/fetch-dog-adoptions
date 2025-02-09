import "./../../css/DogCard.css";

interface DogProps {
  id: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
  img: string;
}

const DogCard = ({ name, breed, age, zip_code, img }: DogProps) => {
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
        <button>Add to Favorites</button>
      </div>
    </article>
  );
};

export default DogCard;
