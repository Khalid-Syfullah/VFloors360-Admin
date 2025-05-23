import React from "react";
import TileList from "../../components/TileList/TileList";
import Layout from "../../components/shared/Layout/Layout";

const TilePage = () => {
  return (
    <div
      className="bg_dark"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      <Layout title="Tiles">
        <TileList />
      </Layout>
    </div>
  );
};

export default TilePage;
