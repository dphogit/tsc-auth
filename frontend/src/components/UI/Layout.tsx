import Container from "@material-ui/core/Container";
import { Helmet } from "react-helmet";

const Layout: React.FC = (props) => {
  return (
    <Container maxWidth="md">
      <div className="app-container">
        <Helmet>
          <title>Authentication App</title>
          <meta
            name="description"
            content="Authentication application created with React"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Helmet>
        {props.children}
      </div>
    </Container>
  );
};

export default Layout;
