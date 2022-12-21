import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/profile/Profile";
import { useEffect, useState } from "react";
import { client, recommendedProfiles } from "./api";

function App() {
  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await client.query(recommendedProfiles).toPromise();
      setProfiles(response.data.recommendedProfiles);
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path=":id" element={<Profile id=":id" />} />
      </Routes>
    </Router>
  );
}

export default App;
