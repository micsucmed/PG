import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Petitions = ({ url }) => {
  const [simulations, setSimulations] = useState([]);

  const fetchData = useCallback(async () => {
    const result = await axios.get(url + "api/petitions/");
    setSimulations(result);
    console.log(result);
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderSimulations = () => {
    return <h1>Simulations</h1>;
  };

  return renderSimulations();
};

export default Petitions;
