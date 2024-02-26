import { Link } from "react-router-dom";

export default function OrganizationCard({ description, id, name }) {
  return (
    <div className="OrganizationCard">
      <Link to={`/profile/${id}`}>
        <p>{name}</p>
        <p>{description}</p>
      </Link>
    </div>
  );
}
