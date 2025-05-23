import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./TileList.module.scss";
import { connect } from "react-redux";
import { BsFileEarmarkPlus, BsTrash } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { useModals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { toast } from "react-toastify";
import { getTileList, deleteTile } from "../../actions/Tile.action";
import { BASE_URL } from "../../constants/URL";

const queryString = require("query-string");

const TileList = ({ tiles, getTileList, deleteTile }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const modals = useModals();
  const navigate = useNavigate();

  const location = useLocation();
  const parsed = queryString.parse(location.search);
  let page = 1;

  useEffect(() => {
    if (parsed.page) {
      page = parsed.page;
    }

    const loadTiles = async () => {
      setLoading(true);
      const tilesFromServer = await getTileList(page);
      setList(tilesFromServer || []);
      setLoading(false);
    };

    // Call loadTiles if tiles are not yet fetched or page changes
    if (!tiles || tiles.length === 0 || parsed.page) {
      loadTiles();
    } else {
      setList(tiles);
      setLoading(false);
    }
  }, [tiles, parsed.page]);

  const [searchText, setSearchText] = useState("");

  const searchHandler = (text) => {
    if (text !== "") {
      setList({
        ...tiles,
        items: tiles.items.filter((item) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        ),
      });
    } else {
      setList(tiles);
    }
    setSearchText(text);
  };

  const deleteHandler = (id) =>
    modals.openConfirmModal({
      title: "Delete this tile",
      centered: true,
      children: (
        <Text size="md">
          Are you sure you want to delete this tile? This action is destructive
          and cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete Tile", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => confirmHandler(id),
    });

  const confirmHandler = async (id) => {
    let check = await deleteTile(id);
    if (check === true) {
      toast.success("Tile deleted successfully");
      navigate("/tile");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Container className="pb-4">
      <div className="d-flex justify-content-between align-items-center pb-3 ">
        <div className="d-flex align-items-center w-100">
          <span className="d-block fs-4">Search Tiles</span>
          <Form.Control
            type="text"
            placeholder="Search tile by name..."
            className={`${styles.searchInput}`}
            onChange={(e) => searchHandler(e.target.value)}
            value={searchText}
          />
        </div>
        <div className="">
          <Link to="/tile/add" className={styles.add}>
            <BsFileEarmarkPlus />
          </Link>
        </div>
      </div>
      <Card className="crd p-md-4 pb-md-0 p-2">
        <Card.Body>
          {tiles === null ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: 600 }}
            >
              <Spinner variant="dark" animation="grow" />
            </div>
          ) : (
            <>
              {list && list.items && list.items.length === 0 && (
                <span className="d-block text-center fs-4 lead pb-4">
                  No Tile Found
                </span>
              )}
              {list &&
                list.items &&
                list.items.map((tileItem, i) => (
                  <Row
                    key={tileItem._id}
                    className={`mb-3 pb-3 ${
                      list.items.length - 1 === i ? "" : "border-bottom"
                    }`}
                  >
                    <Col md={2}>
                      <Row>
                        <Col
                          md={7}
                          className={`${styles.small} d-flex align-items-center`}
                        >
                          <div className={styles.img_wrapper}>
                            <img
                              crossOrigin="anonymous"
                              src={`${BASE_URL}/image/small/${tileItem.image}`}
                              alt={tileItem.name}
                              className={styles.img}
                            />
                          </div>
                        </Col>
                        <Col
                          md={3}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <div className={styles.line}></div>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={9} className="">
                      <div className="d-flex align-items-center h-100">
                        <div>
                          <div className={` fw-bold ${styles.link}`}>
                            {tileItem.name}
                          </div>
                          <div className="text-muted">
                            <strong>Brand:</strong> {tileItem.brand}
                          </div>
                          <div className="text-muted">
                            <strong>Category:</strong> {tileItem.category}
                          </div>
                          <div className="text-muted">
                            <strong>Size:</strong> {tileItem.size}
                          </div>
                          <div className="text-muted">
                            <strong>Area Coverage:</strong> {tileItem.areaCoverage} m²
                          </div>
                          <div className="text-muted">
                            <strong>Price:</strong> ${tileItem.price}
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col
                      md={1}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Link
                        to={`/tile/${tileItem._id}/edit`}
                        className={` fw-bold fs-4 ${styles.link}`}
                      >
                        <AiOutlineEdit />
                      </Link>
                      <span
                        className={`ms-3 fw-bold fs-4 ${styles.link}`}
                        onClick={() => deleteHandler(tileItem._id)}
                      >
                        <BsTrash className="text-danger" />
                      </span>
                    </Col>
                  </Row>
                ))}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  tiles: state.tile.tiles,
});

export default connect(mapStateToProps, { getTileList, deleteTile })(
  TileList
);
