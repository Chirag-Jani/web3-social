import { useEffect, useState } from "react";
import { client, getProfile, getPublications } from "../../api";
import abi from "../../abi.json";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";

const Profile = (props) => {
  const id = useLocation().pathname.slice(1);

  const [profile, setProfile] = useState();
  const [pub, setPub] = useState([]);

  const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

  useEffect(() => {
    fetchProfile(id);
  });

  const fetchProfile = async () => {
    try {
      const response = await client.query(getProfile, { id }).toPromise();
      setProfile(response.data.profiles.items[0]);

      const getPosts = await client.query(getPublications, { id }).toPromise();
      setPub(getPosts.data.publications.items);
    } catch (error) {
      console.log(error);
    }
  };

  const connect = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
  };

  const followUser = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, abi, signer);

    try {
      const follow = await contract.follow([id], [0x0]);
      follow.wait();
      console.log("Followed Successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  if (!profile) return null;

  return (
    <div>
      <div className="d-flex m-5">
        <div>
          {profile.coverPicture ? (
            <img
              className="rounded-circle my-2"
              width="80px"
              height="80px"
              src={`${profile.coverPicture.original.url}`}
              alt="Profile Image of an User"
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
          <p className=""> @{profile.handle}</p>
          <p className="fw-bold"> {profile.name}</p>
          <p> {profile.bio}</p>
          <button className="btn btn-primary" onClick={followUser}>
            Follow
          </button>
          <button className="mx-2 btn btn-success" onClick={connect}>
            Connect
          </button>
        </div>

        <div className="d-flex mt-2">
          <h5 className="mx-4">{profile.stats.totalFollowers} Posts</h5>
          <h5 className="mx-4">{profile.stats.totalPosts} Followers</h5>
          <h5 className="mx-4">{profile.stats.totalFollowing} Following</h5>
        </div>
      </div>

      <div>
        <div className="border-bottom border-dark mt-5">
          <h3 className="ps-3">Posts by user:</h3>
        </div>
        {pub.map((item, index) => {
          return (
            <div key={index} className="ps-3 border-bottom border-dark p-3">
              <p>{item.metadata.content}...</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
