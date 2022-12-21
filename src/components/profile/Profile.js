import { useRouter } from "next/router";
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
    console.log(id);

    if (id) {
      fetchProfile(id);
    }
  }, []);

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
      <div className="d-flex ">
        <div>
          <h4>Handle: {profile.handle}</h4>
          <h4>Name: {profile.name}</h4>
          <h4>Bio: {profile.bio}</h4>
        </div>
        <div className="d-flex">
          <h4>{profile.stats.totalFollowers} Posts</h4>
          <h4>{profile.stats.totalPosts} Followers</h4>
          <h4>{profile.stats.totalFollowing} Following</h4>
        </div>
      </div>

      <button className="mx-2" onClick={connect}>
        Connect
      </button>
      <button className="mx-2" onClick={followUser}>
        Follow
      </button>
      <div>
        {pub.map((item, index) => {
          return (
            <div key={index} className="my-2">
              <h3>{item.metadata.content}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
