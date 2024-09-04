import Page from "@vuo/templates/Page";
import Button from "@vuo/atoms/Button";
import FixFoodLogo from "@vuo/atoms/FixFoodLogo";
import { LogoVariants } from "@vuo/utils/LogoUtils";

const Home = function (props: any) {
  return (
    <Page containerClass="flex flex-col">
      <div className="home flex flex-col">
        <FixFoodLogo className="logo" variant={LogoVariants.default} />

        <div className="flex flex-col gap-small">
          <Button tabIndex={0} block color="primary" size="large" type="submit">
            This is a Button
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default Home;
