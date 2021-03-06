import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import DogCard from "./dogCard";
import "../css/dogcard.css";
import axios from "axios";

function DogAdopter({ doUpdateLikedDogs }) {
  // Backend stuff
  const bp = require("../../bp.js");
  const storage = require("../../tokenStorage.js");
  const jwt = require("jsonwebtoken");
  var tok = storage.retrieveToken();
  var ud = jwt.decode(tok, { complete: true });
  var userID = ud.payload.userId;
  var zipCode = ud.payload.location;

  // State variables
  const [dogs, setDogs] = useState([]);

  // Loading dogs from database
  const getDogs = async () => {
    var obj = {
      Location: zipCode,
      id: userID,
    };

    var js = JSON.stringify(obj);

    try {
      // Axios code follows
      var config = {
        method: "post",
        url: bp.buildPath("displayDogs"),
        headers: {
          "Content-Type": "application/json",
        },

        data: js,
      };

      axios(config)
        .then(function (response) {
          var res = response.data;

          if (res.error) {
            console.log(res);
          } else {
            if (!dogs.length) {
              setDogs(res);
            }
          }
        })
        .catch(function (error) {
          // setMessage(error);
        });
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  // Get dogs
  useEffect(() => {
    getDogs();
  }, [dogs.length]);

  // When user clicks like or skip, dog is removed from dogs array
  function removeDogCard(id) {
    setDogs(dogs.filter((dog) => dog._id !== id));
  }

  // console.log(dogs);

  return (
    <Container fluid className=" bkgd-card-color" style={{ overflow: "auto", height: "95vh" }}>
      <Row className="justify-content-center">
        {dogs.length !== 0 ? (
          dogs
            .map((dog) => (
              <Row className="justify-content-center card-container">
                <DogCard doUpdateLikedDogs={doUpdateLikedDogs} key={dog._id} dog={dog} removeDogCard={removeDogCard} />
              </Row>
            ))
            .reverse()
        ) : (
          <div className="no-dogs">
            <br />
            <Spinner style={{ width: "100px", height: "100px" }} animation="grow" />
            <br />
            <br />
            <p>
              Sorry there are no more dogs up for adoption in your area <i className="fa fa-frown-o "></i>.
            </p>
            <p>Change your search area or come back later.</p>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default DogAdopter;
