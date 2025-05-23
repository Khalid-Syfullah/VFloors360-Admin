import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  Button,
  Card,
  InputGroup,
  Form as BootstrapForm,
  ProgressBar,
  Modal
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import AnimatedBG from "../shared/AnimatedBG/AnimatedBG";
import styles from "./Signup.module.css";
import { signup } from "../../actions/Auth.action";
import { connect, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../assets/logo.jpg";

const Signup = ({ signup }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const onSubmitHandler = async (values) => {
    setIsLoading(true);
    const { confirmPassword, ...signupData } = values;
    let check = await signup(signupData);
    if (check === true) {
      setIsLoading(false);
      setShowModal(true); // Show modal on successful signup
    } else {
      setIsLoading(false);
    }
  };

  const initVals = {
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required!")
      .min(2, "Name is too short!"),
    username: Yup.string()
      .required("Username is required!")
      .min(3, "Username is too short!"),
    password: Yup.string()
      .required("Password is required!")
      .min(6, "Password is too short!"),
    confirmPassword: Yup.string()
      .required("Confirm your password!")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/"); // Navigate to another page or stay as needed
  };

  return (
    <>
      <AnimatedBG />
      <div className={styles.wrapper}>
        <Card bg="light" text="dark" className={`${styles.crd} shadow`}>
          <Card.Body>
            <div className="d-flex justify-content-center">
              <img src={logo} alt="" className="w-25" />
            </div>
            <h1 className="fs-4 fw-normal py-3 text-center">VFLOORS360 ADMIN</h1>
            <Formik
              initialValues={initVals}
              validationSchema={SignupSchema}
              onSubmit={(values) => onSubmitHandler(values)}
            >
              {({ errors, touched }) => (
                <Form>
                  <InputGroup className="mb-3 d-flex flex-column">
                    <label htmlFor="name" className="d-block">
                      Name
                    </label>
                    <Field
                      as={BootstrapForm.Control}
                      placeholder="Enter Name"
                      name="name"
                      isValid={!errors.name && touched.name}
                      type="text"
                      className={`${styles.input} w-100`}
                      isInvalid={errors.name && touched.name}
                    />
                    {errors.name && touched.name ? (
                      <small className="text-danger pt-2">
                        {errors.name}
                      </small>
                    ) : null}
                  </InputGroup>

                  <InputGroup className="mb-3 d-flex flex-column">
                    <label htmlFor="username" className="d-block">
                      Username
                    </label>
                    <Field
                      as={BootstrapForm.Control}
                      placeholder="Enter Username"
                      name="username"
                      isValid={!errors.username && touched.username}
                      type="text"
                      className={`${styles.input} w-100`}
                      isInvalid={errors.username && touched.username}
                    />
                    {errors.username && touched.username ? (
                      <small className="text-danger pt-2">
                        {errors.username}
                      </small>
                    ) : null}
                  </InputGroup>

                  <InputGroup className="mb-3 d-flex flex-column">
                    <label htmlFor="password" className="d-block">
                      Password
                    </label>
                    <Field
                      as={BootstrapForm.Control}
                      name="password"
                      placeholder="Enter Password"
                      isValid={!errors.password && touched.password}
                      type={isPasswordVisible ? "text" : "password"}
                      className={`${styles.input} w-100 icon-hidden`}
                      isInvalid={errors.password && touched.password}
                      style={{ position: "relative" }}
                    />
                    {!isPasswordVisible ? (
                      <AiOutlineEye
                        className={styles.eyeIcon}
                        color="black"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className={styles.eyeIcon}
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      />
                    )}
                    {errors.password && touched.password ? (
                      <small className="text-danger pt-2">
                        {errors.password}
                      </small>
                    ) : null}
                  </InputGroup>

                  <InputGroup className="mb-3 d-flex flex-column">
                    <label htmlFor="confirmPassword" className="d-block">
                      Confirm Password
                    </label>
                    <Field
                      as={BootstrapForm.Control}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      isValid={!errors.confirmPassword && touched.confirmPassword}
                      type={isPasswordVisible ? "text" : "password"}
                      className={`${styles.input} w-100 icon-hidden`}
                      isInvalid={errors.confirmPassword && touched.confirmPassword}
                      style={{ position: "relative" }}
                    />
                    {!isPasswordVisible ? (
                      <AiOutlineEye
                        className={styles.eyeIcon}
                        color="black"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className={styles.eyeIcon}
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      />
                    )}
                    {errors.confirmPassword && touched.confirmPassword ? (
                      <small className="text-danger pt-2">
                        {errors.confirmPassword}
                      </small>
                    ) : null}
                  </InputGroup>

                  <div className="pt-4">
                    {isLoading ? (
                      <ProgressBar animated now={100} />
                    ) : (
                      <Button
                        variant="primary"
                        type="submit"
                        className={styles.btn}
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing up..." : "Sign Up"}
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>

            <div className="text-center mt-3">
              <small className="text-muted">
                Already have an account? <Link to="/login">Login</Link>
              </small>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Modal for successful signup */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Signup Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your account has been successfully created.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalClose}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { signup })(Signup);
