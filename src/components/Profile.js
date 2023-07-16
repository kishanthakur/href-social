import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const storedData = useSelector((state) => state.data.storedData);
  return <h1>{storedData.photo}</h1>;
}
