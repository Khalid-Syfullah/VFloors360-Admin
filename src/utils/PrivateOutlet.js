import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const PrivateOutlet = ({ auth, loading }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (auth === false) {
      // let check = getRefreshToken();
      let check = true;
      if (check === true) {
        return <Outlet />;
      } else {
        navigate("/");
      }
    }
  }, [auth]);
  return auth === true && loading === false ? (
    <Outlet />
  ) : (
    <Navigate to={`/`} />
  );
  //return <Outlet />;
};

const mapStateToProps = (state) => ({
  auth: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, null)(PrivateOutlet);
