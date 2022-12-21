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
      console.log(response);
      setProfiles(response.data.recommendedProfiles);
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <>
      <div className="d-flex flex-column flex-wrap align-middle text-center justify-content-center mt-5">
        <h1 className="m-3">
          Here are some recommended profiles from{" "}
          <a href="https://lens.xyz" target="_blank" rel="noreferrer">
            LensProtocol
          </a>
        </h1>
        <div className="d-flex flex-wrap align-middle justify-content-center">
          {profiles.map((profile, index) => {
            return (
              <div
                className="border rounded border-2 border-dark m-2 p-3 w-25 text-start"
                key={index}
              >
                <div className="d-flex flex-column">
                  {profile.coverPicture ? (
                    <img
                      className="rounded-circle my-2"
                      width="80px"
                      height="80px"
                      src={`${profile.coverPicture.original.url}`}
                      alt="Profile Image of an user"
                    />
                  ) : (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "black",
                        borderRadius: "50%",
                      }}
                    ></div>
                  )}
                  <Link className="fw-bold my-2" to={`${profile.id}`}>
                    {profile.handle}
                  </Link>
                  <p className="">{profile.bio}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
