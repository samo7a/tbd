import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Form, Button, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../css/editProfile.css";
import defProfilePic from "../../img/def-pic.jpg";
import axios from "axios";
import { uploadFile } from "../images.js";
import ImageUploading from "react-images-uploading";

function EditProfile() {
  const bp = require("../../bp.js");
  const storage = require("../../tokenStorage.js");
  const jwt = require("jsonwebtoken");

  var tok = storage.retrieveToken();
  var ud = jwt.decode(tok, { complete: true });
  var userID = ud.payload.userId;
  var tokenFirstName = ud.payload.firstName;
  var tokenLastName = ud.payload.lastName;
  var tokenEmail = ud.payload.email;
  var tokenPhone = ud.payload.phone;
  var tokenLocation = ud.payload.location;
  var tokenBio = ud.payload.bio;

  const doEditUser = async (event) => {
    var obj = {
      UserID: userID,
      FirstName: firstName,
      LastName: lastName,
      Location: location,
      Phone: phone,
      ProfilePicture: "GridFS shit",
      ShortBio: bio,
    };

    var js = JSON.stringify(obj);

    try {
      // Axios code follows
      var config = {
        method: "post",
        url: bp.buildPath("editUser"),
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
            localStorage.removeItem("user_data");
            storage.storeToken(res);
            setEditMode(false);
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

  // Profile picture upload
  const [images, setImages] = useState([]);
  const [isImageChanged, setImageChanged] = useState(false);
  const onUpload = (image) => {
    setImages(image);
    uploadFile(image[0].file, userID);
    setImageChanged(true);
  };

  const [isEditing, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(tokenFirstName);
  const [lastName, setLastName] = useState(tokenLastName);
  const [location, setLocation] = useState(tokenLocation);
  const [phone, setPhone] = useState(tokenPhone);
  const [bio, setBio] = useState(tokenBio);

  const onEdit = () => {
    doEditUser();
  };

  return (
    <Container fluid className="profile-color" style={{ overflow: "auto", height: "90vh" }}>
      {isEditing ? (
        <>
          <Row className="justify-content-center">
            <ImageUploading single onChange={onUpload} dataURLKey="data_url">
              {({ onImageUpload }) => (
                <>
                  <button
                    className="pic-button"
                    onClick={onImageUpload}
                    style={{
                      backgroundImage: `url(${isImageChanged ? images[0].data_url : "https://wo0of.s3.amazonaws.com/" + userID})`,
                      backgroundSize: "cover",
                    }}
                  ></button>
                </>
              )}
            </ImageUploading>
          </Row>
          <Form>
            <Form.Group className="forms-margin">
              <Form.Label>First Name</Form.Label>
              <Form.Control defaultValue={tokenFirstName} placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
            </Form.Group>

            <Form.Group className="forms-margin">
              <Form.Label>Last Name</Form.Label>
              <Form.Control defaultValue={tokenLastName} placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
            </Form.Group>

            <Form.Group className="forms-margin">
              <Form.Label>Phone</Form.Label>
              <Form.Control defaultValue={tokenPhone} placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
            </Form.Group>

            <Form.Group className="forms-margin">
              <Form.Label>Location</Form.Label>
              <Form.Control defaultValue={tokenLocation} placeholder="Zip Code" onChange={(e) => setLocation(e.target.value)} />
            </Form.Group>

            <Form.Group className="forms-margin">
              <Form.Label>Bio</Form.Label>
              <Form.Control defaultValue={tokenBio} placeholder="Bio" as="textarea" onChange={(e) => setBio(e.target.value)} />
            </Form.Group>
          </Form>
          <Row className="justify-content-center">
            <Button className="edit-prof-btn" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
            <Button className="edit-prof-btn" onClick={onEdit}>
              Confirm Edits
            </Button>
          </Row>
        </>
      ) : (
        <>
          <Row className="justify-content-center">
            {/* <img className="profile-pic" alt="Profile" id="userProfilePic" src={"https://wo0of.s3.amazonaws.com/" + userID} /> */}
            <div className="profile-pic" style={{ backgroundImage: `url(https://wo0of.s3.amazonaws.com/${userID})`, backgroundSize: "cover" }}></div>
          </Row>
          <div>
            <p className="profile-htext-top">Name</p>
            <p className="profile-text">{tokenFirstName + " " + tokenLastName}</p>
            <p className="profile-htext">Email</p>
            <p className="profile-text">{tokenEmail}</p>
            <p className="profile-htext">Phone</p>
            <p className="profile-text">{tokenPhone == null ? " " : tokenPhone}</p>
            <p className="profile-htext">Location</p>
            <p className="profile-text">{tokenLocation == null ? " " : tokenLocation}</p>
            <p className="profile-htext">Bio</p>
            <p className="profile-text">{tokenBio == null ? " " : tokenBio} </p>
          </div>
          <Row className="justify-content-center">
            <Button className="edit-prof-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          </Row>
        </>
      )}
    </Container>
  );
}

export default EditProfile;
