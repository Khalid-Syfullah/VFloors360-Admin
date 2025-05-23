import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./StatCard.module.css";

const StatCard = ({ icon, title, count, link }) => {
  return (
    <div className={styles.crd}>
      <Row>
        <Col xs={3}>
          <div className={styles.icon}>{icon}</div>
        </Col>
        <Col xs={9}>
          {link ? (
            <Link to={link} className={styles.link}>
              <div className={styles.title}>{title}</div>
            </Link>
          ) : (
            <div className={styles.title}>{title}</div>
          )}

          {count ? <div className={styles.count}>{count}</div> : <></>}
        </Col>
      </Row>
    </div>
  );
};

export default StatCard;
