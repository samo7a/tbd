// import React from "react";
import { Container, Row, Col, Card, Modal, Carousel, Form, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/login.css";
import logo from "../img/logo.png";
import dogPic1 from "../img/good-dog.jpeg";
import dogPic2 from "../img/dogPic2.jpg";
import dogPic3 from "../img/dogPic3.jpg";
import dogPic4 from "../img/dogPic4.jpg";
import dogPic5 from "../img/dogPic5.jpg";
import dogPic6 from "../img/dogPic6.jpg";

function Login() {
  const bp = require("../bp.js");
  const storage = require("../tokenStorage.js");

  // Input variables to be sent via JSON
  var email;
  var password;
  var firstName;
  var lastName;

  const doLogin = async (event) => {
    event.preventDefault();

    var obj = { Email: email.value, Password: password.value };
    var js = JSON.stringify(obj);

    try {
      // Axios code follows
      var config = {
        method: "post",
        url: bp.buildPath("login"),
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
            window.location.href = "/";
          } else {
            storage.storeToken(res);
            window.location.href = "/home";
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

  const doSignUp = async (event) => {
    event.preventDefault();

    var obj = { Email: email.value, Password: password.value, FirstName: firstName.value, LastName: lastName.value, isOwner: checked };

    var js = JSON.stringify(obj);

    try {
      // Axios code follows
      var config = {
        method: "post",
        url: bp.buildPath("signup"),
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
            window.location.href = "/";
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

  const doResetPassword = async (event) => {
    var obj = { Email: email.value };

    var js = JSON.stringify(obj);

    try {
      // Axios code follows
      var config = {
        method: "post",
        url: bp.buildPath("resetPassword"),
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
            window.location.href = "/";
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

  // const uploadPhoto = async (event) => {
  //
  //   var formData = new FormData();
  //   var imagefile = document.getElementById("profilePic");
  //   formData.append("file", imagefile.files[0]);
  //
  //   console.log(formData);
  //
  //   try {
  //     // Axios code follows
  //     var config = {
  //       method: "post",
  //       url: bp.buildPath("profilePicture"),
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         "userid": userID,
  //       },
  //
  //       data: formData,
  //     };
  //
  //     axios(config)
  //       .then(function (response) {
  //         var res = response.data;
  //         if (res.error) {
  //           console.log(res);
  //         } else {
  //           console.log("Response: " + JSON.stringify(res));
  //         }
  //       })
  //       .catch(function (error) {
  //         // setMessage(error);
  //         console.log(error);
  //       });
  //   } catch (e) {
  //     alert(e.toString());
  //     return;
  //   }
  // };

  const [showSignUp, setShowSignUp] = useState(false);
  const handleCloseSignUp = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);

  const [showResetPassword, setShowResetPassword] = useState(false);
  const handleCloseResetPassword = () => setShowResetPassword(false);
  const handleShowResetPassword = () => setShowResetPassword(true);

  const [checked, setChecked] = useState(false);
  const handleClick = () => setChecked(!checked);

  return (
    <Container fluid className="vh-100 overflow-hidden">
      {/* Logo */}
      <Row className="justify-content-center header-color">
        <img src={logo} className="Login-logo" alt="Woof Logo" />
      </Row>
      <Row className="background justify-content-center">
        {/* Card Form */}
        <Col className="justify-content-center">
          {/* Description */}
          <Row style={{ marginTop: "10vh" }}></Row>
          <Row className="background justify-content-center">
            <p className="login-text">
              Let us help you find your new best friend. Woof helps connect dogs with the people that can provide them a loving home.
            </p>
            <Card className="card-style">
              <Card.Body>
                <Form>
                  <Form.Group className="emailTextbox" controlId="formBasicEmail" style={{ margin: "5% 2%" }}>
                    <Form.Control type="email" placeholder="Email Address " ref={(c) => (email = c)} />
                  </Form.Group>

                  <Form.Group className="passwordTextbox" controlId="formBasicPassword" style={{ margin: "5% 2%" }}>
                    <Form.Control type="password" placeholder="Password" ref={(c) => (password = c)} />
                  </Form.Group>

                  <Row className="justify-content-center">
                    <Button className="login-btn" onClick={doLogin}>
                      Login
                    </Button>
                  </Row>
                  <Row className="justify-content-center">
                    <Button className="signup-btn" onClick={handleShowSignUp}>
                      Sign Up
                    </Button>
                  </Row>
                  <Row className="justify-content-center">
                    <Button className="frgtpwd" onClick={handleShowResetPassword}>
                      Forgot your password?
                    </Button>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Row>
        </Col>

        {/* Dog Photos */}
        <Col className="justify-content-center">
          <Row className="justify-content-center">
            <Carousel fade controls={false} indicators={false} className="caro">
              <Carousel.Item>
                <img src={dogPic1} className="dog-login-photo" alt="Dog" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={dogPic2} className="dog-login-photo" alt="Dog" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={dogPic3} className="dog-login-photo" alt="Dog" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={dogPic4} className="dog-login-photo" alt="Dog" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={dogPic5} className="dog-login-photo" alt="Dog" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={dogPic6} className="dog-login-photo" alt="Dog" />
              </Carousel.Item>
            </Carousel>
          </Row>
        </Col>
      </Row>

      {/* Dont touch */}
      <Row className="background vh-100"></Row>

      {/* Signup */}
      <Modal show={showSignUp} onHide={handleCloseSignUp}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up For Woof</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="firstNameTextbox" controlId="formBasicEmail">
            <Form.Control type="text" placeholder="First Name" ref={(c) => (firstName = c)} />
          </Form.Group>

          <Form.Group className="lastNameTextbox" controlId="formBasicEmail">
            <Form.Control type="text" placeholder="Last Name" ref={(c) => (lastName = c)} />
          </Form.Group>

          <Form.Group className="emailTextbox" controlId="formBasicEmail">
            <Form.Control type="email" placeholder="Email Address" ref={(c) => (email = c)} />
          </Form.Group>

          <Form.Group className="passwordTextbox" controlId="formBasicPassword">
            <Form.Control type="password" placeholder="Password" ref={(c) => (password = c)} />
          </Form.Group>

          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="I Am An Owner" onClick={handleClick} checked={checked} />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button className="signup-btn" onClick={doSignUp}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reset Password Modal */}
      <Modal show={showResetPassword} onHide={handleCloseResetPassword}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Your Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Enter your email and we'll send you an email to reset your password.</p>
          <Form.Group className="emailTextbox" controlId="formBasicEmail">
            <Form.Control type="email" placeholder="Email Address" ref={(c) => (email = c)} />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button
            className="signup-btn"
            onClick={() => {
              handleCloseResetPassword();
              doResetPassword();
            }}
          >
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Login;
