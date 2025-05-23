import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  Button,
  Card,
  InputGroup,
  Form as BootstrapForm,
  ProgressBar,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import AnimatedBG from "../shared/AnimatedBG/AnimatedBG";
import styles from "./Login.module.css";
import { login } from "../../actions/Auth.action";
import { connect, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../assets/logo.jpg";

const Login = ({ login }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  const onSubmitHandler = async (values) => {
    setIsLoading(true);
    let check = await login(values);
    if (check === true) {
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 1000);
    } else {
      setIsLoading(false);
    }
  };

  let initVals = {
    username: "",
    password: "",
  };

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required!").min(3, "Username is too short!"),
    password: Yup.string().required("Password is required!").min(6, "Password is too short!"),
  });

  return (
    <>
      <AnimatedBG />
      <div className={styles.wrapper}>
        <Card bg="light" text="dark" className={`${styles.crd} shadow`}>
          <Card.Body>
            <div className="d-flex justify-content-center">
              <img src={logo} alt="" className="w-25" />
            </div>
            <h1 className="fs-4 fw-normal py-3 text-center">TPT VR ADMIN</h1>
            <Formik
              initialValues={initVals}
              validationSchema={LoginSchema}
              onSubmit={(values) => onSubmitHandler(values)}
            >
              {({ errors, touched }) => (
                <Form>
                  <InputGroup className="mb-3 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <label htmlFor="username" className="d-block">
                        Username
                      </label>
                    </div>
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
                      <small className="text-danger pt-2">{errors.username}</small>
                    ) : null}
                  </InputGroup>

                  <InputGroup className="mb-3 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="password" className="d-block">
                        Password
                      </label>
                      {errors.password && touched.password ? (
                        <small className="text-danger">{errors.password}</small>
                      ) : null}
                    </div>
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
                        Login
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>

            <div className="text-center mt-3">
              <small className="text-muted">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </small>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { login })(Login);
