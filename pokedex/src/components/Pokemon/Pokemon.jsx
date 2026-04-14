import { useState } from "react";
import "./Pokemon.css";
import { Link } from "react-router-dom";

function Pokemon({ name, image, id }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="pokemon">

    <Link style={{ textDecoration: 'none', color: 'inherit' }} className="pokemon-link" to={`/pokemon/${id}`}>
      <div className="pokemon-name">{name}</div>

      <div className="image-wrapper">
        {loading && <div className="loader1"></div>}

        <img
          className={`pokemon-image ${loading ? "hidden" : ""}`}
          src={image}
          alt={name}
          onLoad={() => setLoading(false)}
        />
      </div>

      </Link>
    </div>
  );
}

export default Pokemon;