import React from "react";
import InstagramAuth from "../components/InstagramAuth";
import InstagramFeed from "../components/InstagramFeed";

function Instagram() {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Instagram Feed</h1>
      <InstagramAuth />
      <InstagramFeed />
    </div>
  );
}

export default Instagram;
