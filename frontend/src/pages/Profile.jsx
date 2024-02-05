import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect } from "react";

const profile = {
  name: "name",
  description: "description",
};

export default function ProfilePage() {
  const uid = useParams().id;
  return (
    <>
      <Header />

      <h1>{profile.name}</h1>
      <h2>ID: {uid}</h2>
    </>
  );
}
