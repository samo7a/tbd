import { Container, Row, Col } from "react-bootstrap";
import ProfileHeader from "./components/profileHeader";
import NavbarProfile from "./components/navbar";
import DogAdopter from "./components/dogAdopter";
import DogManager from "./components/dogManager";

function Home() {
  const storage = require("../tokenStorage.js");
  const jwt = require("jsonwebtoken");

  var tok = storage.retrieveToken();
  var ud = jwt.decode(tok, { complete: true });

  var userID = ud.payload.userId;
  var firstName = ud.payload.firstName;
  var lastName = ud.payload.lastName;
  const fullName = firstName + " " + lastName;
  var isOwner = ud.payload.isOwner;

  return (
    <Container fluid className="vh-100 overflow-hidden">
      <Row style={{ height: "5vh" }}>
        <ProfileHeader name={fullName} page="Woof" />
      </Row>
      <Row style={{ height: "95vh" }}>
        {/* Left column displaying The navigation bar
                and profile or chat under it*/}
        <Col style={{ height: "95vh" }} sm={4}>
          <NavbarProfile style={{ height: "95vh" }} isOwner={isOwner} />
        </Col>
        {/* Right Column showing home for owner or adopter*/}
        <Col sm={8}>
          <Row>{isOwner === false ? <DogAdopter /> : <DogManager />}</Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
