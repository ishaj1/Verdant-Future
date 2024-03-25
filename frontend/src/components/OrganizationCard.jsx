import { Link } from "react-router-dom";

export default function OrganizationCard({
  description,
  id,
  profile_link,
  name,
}) {
  return (
    <div className="OrganizationCard">
      <Link to={profile_link}>
        <p>{name}</p>
        <p>{description}</p>
      </Link>
    </div>
  );
}
