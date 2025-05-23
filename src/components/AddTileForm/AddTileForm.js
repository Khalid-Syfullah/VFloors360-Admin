import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  Button,
  Card,
  InputGroup,
  Form as BootstrapForm,
  Container,
} from "react-bootstrap";
import * as Yup from "yup";
import styles from "./AddTileForm.module.scss";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { createTile, updateTile } from "../../actions/Tile.action";
import { toast } from "react-toastify";

const AddTileForm = ({ createTile, update, data, updateTile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tileImage, setTileImage] = useState(undefined);
  const navigate = useNavigate();

  const onSubmitHandler = async (values) => {
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    try {

      let result = update
        ? await updateTile(values, tileImage, data._id)
        : await createTile(values, tileImage);

      if (result === true) {
        toast.success(update ? "Tile updated successfully!" : "Tile added successfully!");
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        toast.error("An error occurred while processing your request.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setTileImage(undefined);
      return;
    }
    if (e.target.files[0].size > 2000000) {
      toast.error("File size must be less than 2MB");
      return;
    }
    setTileImage(e.target.files[0]);


  };

  const initVals = {
    name: data?.name || "",
    size: data?.size || "",
    areaCoverage: data?.areaCoverage || "",
    price: data?.price || "",
    category: data?.category || "",
    brand: data?.brand || "TPT", // Default to 'TPT' if not provided
    // image: data?.image || "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required!"),
    size: Yup.string().required("Size is required!"),
    areaCoverage: Yup.number().required("Area coverage is required!").positive("Area coverage must be positive!"),
    price: Yup.number().required("Price is required!").positive("Price must be positive!"),
    category: Yup.string().required("Category is required!"),
    brand: Yup.string().notRequired(),
    // image: Yup.string().notRequired(),
  });

  return (
    <Container className="pb-4">
      <Card bg="white" text="dark" className={`crd shadow`}>
        <Card.Body>
          <h1 className="fs-4 fw-normal py-3">
            Fill the form to {update ? "update" : "add"} tile
          </h1>
          <Formik
            initialValues={initVals}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values) => onSubmitHandler(values)}
          >
            {({ errors, touched }) => (
              <Form>
                <InputGroup className="mb-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <label htmlFor="name" className="d-block">
                      Name
                    </label>
                    {errors.name && touched.name ? (
                      <small className="text-danger pt-2">{errors.name}</small>
                    ) : null}
                  </div>
                  <Field
                    as={BootstrapForm.Control}
                    placeholder="Type name of tile..."
                    name="name"
                    isValid={!errors.name && touched.name}
                    type="text"
                    className={`${styles.input} w-100`}
                    isInvalid={errors.name && touched.name}
                  />
                </InputGroup>
                <InputGroup className="mb-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <label htmlFor="size" className="d-block">
                      Size
                    </label>
                    {errors.size && touched.size ? (
                      <small className="text-danger pt-2">{errors.size}</small>
                    ) : null}
                  </div>
                  <Field
                    as={BootstrapForm.Control}
                    placeholder="Type size..."
                    name="size"
                    isValid={!errors.size && touched.size}
                    type="text"
                    className={`${styles.input} w-100`}
                    isInvalid={errors.size && touched.size}
                  />
                </InputGroup>
                <InputGroup className="mb-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <label htmlFor="areaCoverage" className="d-block">
                      Area Coverage
                    </label>
                    {errors.areaCoverage && touched.areaCoverage ? (
                      <small className="text-danger pt-2">{errors.areaCoverage}</small>
                    ) : null}
                  </div>
                  <Field
                    as={BootstrapForm.Control}
                    placeholder="Type area coverage..."
                    name="areaCoverage"
                    type="number"
                    className={`${styles.input} w-100`}
                    isInvalid={errors.areaCoverage && touched.areaCoverage}
                  />
                </InputGroup>
                <InputGroup className="mb-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <label htmlFor="price" className="d-block">
                      Price
                    </label>
                    {errors.price && touched.price ? (
                      <small className="text-danger pt-2">{errors.price}</small>
                    ) : null}
                  </div>
                  <Field
                    as={BootstrapForm.Control}
                    placeholder="Type price..."
                    name="price"
                    type="number"
                    className={`${styles.input} w-100`}
                    isInvalid={errors.price && touched.price}
                  />
                </InputGroup>
                <InputGroup className="mb-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <label htmlFor="category" className="d-block">
                      Category
                    </label>
                    {errors.category && touched.category ? (
                      <small className="text-danger pt-2">{errors.category}</small>
                    ) : null}
                  </div>
                  <Field
                    as={BootstrapForm.Select}  // Use Select component for dropdown
                    name="category"
                    className={`${styles.input} w-100`}
                    isInvalid={errors.category && touched.category}
                  >
                    <option value="">Select Category</option>
                    <option value="Floor">Floor</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Wall">Wall</option>
                    <option value="Outdoor">Outdoor</option>
                  </Field>
                </InputGroup>
                <InputGroup className="mb-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <label htmlFor="brand" className="d-block">
                      Brand
                    </label>
                    {errors.brand && touched.brand ? (
                      <small className="text-danger pt-2">{errors.brand}</small>
                    ) : null}
                  </div>
                  <Field
                    as={BootstrapForm.Control}
                    placeholder="Type brand..."
                    name="brand"
                    type="text"
                    className={`${styles.input} w-100`}
                    isInvalid={errors.brand && touched.brand}
                  />
                </InputGroup>
                <InputGroup className="mb-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center pb-2">
                    <label htmlFor="image" className="d-block">
                      Tile Image
                    </label>
                  </div>
                  <BootstrapForm.Control
                    type="file"
                    id="image"
                    className={`${styles.image} w-100`}
                    onChange={(e) => onSelectFile(e)}
                  />
                </InputGroup>

                <div className="pt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn_primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : update ? "Save" : "Add Tile"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  createTile,
  updateTile,
})(AddTileForm);
