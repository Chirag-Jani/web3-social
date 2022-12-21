import { useState, useEffect } from "react";
import { client, recommendedProfiles } from "../api";
import { Link } from "react-router-dom";

const Home = () => {
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
    <>
      <div className="mx-5">
        {profiles.map((profile, index) => {
          return (
            <div className="" key={index}>
              <div>
                {/* {profile.picture ? (
                    <Image src={profile.picture.original.url} />
                  ) : ( */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "black",
                    borderRadius: "50%",
                  }}
                ></div>
                {/* )} */}
                <Link to={`${profile.id}`}>{profile.handle}</Link>
                <p>{profile.bio}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
