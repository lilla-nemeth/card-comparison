import Page from "@vuo/templates/Page";
import Button from "@vuo/atoms/Button";
import FixFoodLogo from "@vuo/atoms/FixFoodLogo";
import { LogoVariants } from "@vuo/utils/LogoUtils";
import { useNavigate } from "react-router-dom";

const Login = function (props: any) {
  const navigate = useNavigate()
  return (
    <Page>
        <div className="home flex flex-col">
          <FixFoodLogo className="logo" variant={LogoVariants.default} />
          <div className="flex flex-col gap-small">
            <Button tabIndex={0} block color="primary" size="large" type="submit" onClick={() => navigate("/home")}>
              This is a Button
            </Button>
          </div>
        </div>
      {/* </Page> */}
    </Page>
  );
};

export default Login;
