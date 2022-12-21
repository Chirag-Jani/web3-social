import { useEffect, useState } from "react";
import { client, getProfile, getPublications, isFollowedByMe } from "../../api";
import abi from "../../abi.json";
import { ethers } from "ethers";
import { Link, useLocation } from "react-router-dom";

const Profile = (props) => {
  const id = useLocation().pathname.slice(1);

  const [profile, setProfile] = useState();
  const [pub, setPub] = useState([]);
  const [followOrNot, setFollowOrNot] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

  useEffect(() => {
    fetchProfile(id);
    checkFollow(id);
    checkConnection();
  }, [followOrNot]);

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
    setWalletConnected(window.ethereum.isConnected());
  };

  const checkConnection = () => {
    setWalletConnected(window.ethereum.isConnected());
  };

  const followUser = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, abi, signer);

    try {
      const follow = await contract.follow([id], [0x0]);
      follow.wait();
      console.log("Followed Successfully.");
      setFollowOrNot(true);
    } catch (error) {
      console.log(error);
    }
  };

  const checkFollow = async () => {
    const response = await client.query(isFollowedByMe, { id }).toPromise();
    setFollowOrNot(response.data.profile.isFollowedByMe);
  };

  if (!profile) return null;

  return (
    <div>
      <Link to="/" className="btn btn-danger m-4 mx-5">
        Back
      </Link>
      <div className="d-flex m-2 mx-5 justify-content-around">
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
          {!followOrNot ? (
            <button className="btn btn-primary" onClick={followUser}>
              Follow
            </button>
          ) : (
            <button className="btn btn-outline-primary" onClick={followUser}>
              Following
            </button>
          )}

          {walletConnected ? (
            <button className="mx-2 btn btn-outline-success">Connected</button>
          ) : (
            <button className="mx-2 btn btn-success" onClick={connect}>
              Connect
            </button>
          )}
        </div>

        <div className="d-flex mt-2">
          <h5 className="mx-4">
            {profile.stats.totalFollowers} <br /> Posts
          </h5>
          <h5 className="mx-4">
            {profile.stats.totalPosts} <br /> Followers
          </h5>
          <h5 className="mx-4">
            {profile.stats.totalFollowing} <br /> Following
          </h5>
        </div>
      </div>

      <div>
        <div className="border-bottom border-dark mt-5">
          <h3 className="ps-3">Posts by user:</h3>
        </div>
        {pub.map((item, index) => {
          return (
            <div key={index} className="ps-3 border-bottom border-dark p-3">
              <p>{item.metadata.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
