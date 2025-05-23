import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { getTileDetails } from "../../actions/Tile.action";
import AddTileForm from "../../components/AddTileForm/AddTileForm";
import Layout from "../../components/shared/Layout/Layout";

const AddTilePage = ({ edit, data, getTileDetails }) => {
  const { id } = useParams();
  
  useEffect(() => {
    if (edit) {
      getTileDetails(id);
    }
  }, [edit, id, getTileDetails]);

  return (
    <div className="bg_light">
      <Layout title={edit ? (!data ? "Loading..." : data.name) : "Add Tile"}>
        {edit && !data && <Spinner animation="border" variant="dark" />}
        {edit === true && data ? (
          <AddTileForm data={data} update={true} />
        ) : (
          <AddTileForm />
        )}
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => ({
  data: state.tile.selected_tile,
});

export default connect(mapStateToProps, { getTileDetails })(AddTilePage);
