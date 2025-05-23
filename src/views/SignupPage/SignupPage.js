import React from "react";
import Signup from "../../components/Signup/Signup";
import RefreshTokenLayout from "../../components/shared/RefreshTokenLayout/RefreshTokenLayout";

const SignupPage = () => {
  return (
    <>
      <RefreshTokenLayout>
        <Signup />
      </RefreshTokenLayout>
    </>
  );
};

export default SignupPage;
