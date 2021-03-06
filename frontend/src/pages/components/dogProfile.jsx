import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Button, Card, Modal, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../css/dogmanager.css";
import "../css/editProfile.css";
import "font-awesome/css/font-awesome.min.css";
import defProfilePic from "../../img/dogAvatar.jpg";
import axios from "axios";
import { ACTIONS } from "./dogManager";
import { uploadFile } from "../images.js";
import ImageUploading from "react-images-uploading";

function DogProfile({ dog, dispatch, getOwnerDogs, doUpdateLikers }) {
  const bp = require("../../bp.js");
  const storage = require("../../tokenStorage.js");
  const jwt = require("jsonwebtoken");
  var tok = storage.retrieveToken();
  var ud = jwt.decode(tok, { complete: true });
  var userID = ud.payload.userId;
  const [source, setSource] = useState("");
  // setSource("a");

  const doEditDog = async () => {
    // console.log(dog.id);
    var obj = {
      UserID: userID,
      Name: name,
      DogID: dog.id,
      Bio: bio,
      Breed: breed,
      Size: size,
      isPottyTrained: isPottyTrained,
      isNeutered: isNeutered,
      Age: age,
      Sex: sex,
    };
    // console.log(obj.DogID);
    var js = JSON.stringify(obj);

    try {
      // Axios code follows
      var config = {
        method: "post",
        url: bp.buildPath("editDog"),
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
            dispatch({
              type: ACTIONS.EDIT_DOG,
              payload: {
                id: obj.DogID,
                name: obj.Name,
                breed: obj.Breed,
                sex: obj.Sex,
                age: obj.Age,
                size: obj.Size,
                isPottyTrained: obj.isPottyTrained,
                isNeutered: obj.isNeutered,
                bio: obj.Bio,
              },
            });
            setImageChanged(false);
            setImages([]);
            doUpdateLikers();
          }
        })
        .catch(function (error) {});
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  const doDeleteDog = async () => {
    var obj = {
      UserID: userID,
      DogID: dog.id,
    };

    var js = JSON.stringify(obj);

    try {
      // Axios code follows
      var config = {
        method: "post",
        url: bp.buildPath("deleteDog"),
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
          }
          doUpdateLikers();
        })
        .catch(function (error) {});
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  // Dog state variables
  const dog_id = dog.id;
  if (dog_id == null) console.log("dogid " + dog_id);
  const [name, setName] = useState(dog.name);
  const [sex, setSex] = useState(dog.sex);
  const [breed, setBreed] = useState(dog.breed);
  const [age, setAge] = useState(dog.age);
  const [size, setSize] = useState(dog.size);
  const [bio, setBio] = useState(dog.bio);
  const [isNeutered, setIsNeutered] = useState(dog.isNeutered);
  const [isPottyTrained, setIsPottyTrained] = useState(dog.isPottyTrained);

  // Modal controls
  const [details, setShow] = useState(false);
  const showDetails = () => setShow(true);
  const hideDetails = () => setShow(false);

  // Edit state
  const [isEditingDog, setEditingDog] = useState(false);

  // Profile picture upload
  const [images, setImages] = useState([]);
  const [isImageChanged, setImageChanged] = useState(false);
  const onUpload = (image) => {
    setImages(image);
    uploadFile(image[0].file, dog_id);
    setImageChanged(true);
  };

  const handleEditDog = () => {
    doEditDog();
    dispatch("default");
    getOwnerDogs();
    setEditingDog(false);
  };

  const handleDeleteDog = () => {
    doDeleteDog();
    dispatch({
      type: ACTIONS.DELETE_DOG,
      payload: {
        id: dog_id,
      },
    });
  };

  return (
    <>
      <Button className="dog-profile-btn" onClick={showDetails}>
        <div
          className="dog-profile-card"
          style={{
            backgroundImage: `url(https://wo0of.s3.amazonaws.com/${dog.id})`,
          }}
        >
          <h3>{dog.name}</h3>
        </div>
      </Button>
      <Modal show={details} onHide={hideDetails}>
        {isEditingDog ? (
          <>
            <Modal.Header closeButton onClick={() => setEditingDog(false)}>
              <Modal.Title>Edit Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="justify-content-center">
                <ImageUploading single value={images} onChange={onUpload} dataURLKey="data_url">
                  {({ onImageUpload }) => (
                    <>
                      <button
                        className="dog-pic-btn"
                        onClick={onImageUpload}
                        style={{
                          backgroundImage: `url(${isImageChanged ? images[0].data_url : "https://wo0of.s3.amazonaws.com/" + dog.id})`,
                          backgroundSize: "cover",
                        }}
                      ></button>
                    </>
                  )}
                </ImageUploading>
              </Row>
              <br />
              <Form.Group className="dog-name">
                <Form.Label>Name: </Form.Label>
                <Form.Control type="text" defaultValue={dog.name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              <Form.Group className="dog-breed">
                <Form.Label>Breed: </Form.Label>
                <Form.Control type="text" defaultValue={dog.breed} placeholder="Breed" onChange={(e) => setBreed(e.target.value)} />
              </Form.Group>
              <Form.Group style={{ display: "inline" }}>
                <Form.Label style={{ display: "inline" }}>Sex: </Form.Label>
                <Form.Control
                  style={{ display: "inline" }}
                  className="w-25"
                  as="select"
                  defaultValue={dog.sex}
                  custom
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option></option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Control>
              </Form.Group>
              <Form.Group style={{ display: "inline" }} className="dog-age">
                <Form.Label style={{ display: "inline" }}> Age: </Form.Label>
                <Form.Control
                  style={{ display: "inline" }}
                  className="w-25"
                  type="number"
                  defaultValue={dog.age}
                  placeholder="Age"
                  onChange={(e) => setAge(e.target.value)}
                />
              </Form.Group>
              <Form.Group style={{ display: "inline" }} className="dog-size">
                <Form.Label style={{ display: "inline" }}> Size: </Form.Label>
                <Form.Control
                  style={{ display: "inline" }}
                  className="w-25"
                  as="select"
                  defaultValue={dog.size}
                  custom
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option></option>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </Form.Control>
              </Form.Group>
              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label style={{ display: "inline" }}>Potty Trained </Form.Label>
                {isPottyTrained ? (
                  <Form.Check checked style={{ display: "inline" }} onChange={() => setIsPottyTrained(!isPottyTrained)} />
                ) : (
                  <Form.Check style={{ display: "inline" }} onChange={() => setIsPottyTrained(!isPottyTrained)} />
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ display: "inline" }}>Neutered </Form.Label>
                {isNeutered ? (
                  <Form.Check checked style={{ display: "inline" }} onChange={() => setIsNeutered(!isNeutered)} />
                ) : (
                  <Form.Check style={{ display: "inline" }} onChange={() => setIsNeutered(!isNeutered)} />
                )}
              </Form.Group>
              <Form.Group className="dog-bio">
                <textarea
                  className="form-control"
                  rows="3"
                  type="text"
                  defaultValue={dog.bio}
                  placeholder="Bio"
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="edit-prof-btn" onClick={handleEditDog}>
                Confirm Edits
              </Button>
              <Button className="edit-prof-btn" onClick={() => setEditingDog(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            {/* Non editing view */}
            <Modal.Header closeButton onClick={() => setEditingDog(false)}>
              <Modal.Title>Details</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Row className="justify-content-center">
                <img className="dog-img-details" src={"https://wo0of.s3.amazonaws.com/" + dog.id} alt="" />
              </Row>
              <div>
                <br />
                <p className="modal-text ">
                  <p style={{ fontWeight: "500", display: "inline", marginRight: "7px" }}>Name:</p>
                  {dog.name}
                </p>
                <p className="modal-text ">
                  <p style={{ fontWeight: "500", display: "inline", marginRight: "7px" }}>Sex:</p>
                  {dog.sex}
                </p>
                <p className="modal-text ">
                  <p style={{ fontWeight: "500", display: "inline", marginRight: "7px" }}>Breed:</p>
                  {dog.breed}
                </p>
                <p className="modal-text ">
                  <p style={{ fontWeight: "500", display: "inline", marginRight: "7px" }}>Age:</p>
                  {dog.age}
                </p>
                <p className="modal-text ">
                  <p style={{ fontWeight: "500", display: "inline", marginRight: "7px" }}>Size:</p>
                  {dog.size}
                </p>
                <p className="modal-text ">
                  <p style={{ fontWeight: "500", display: "inline", marginRight: "7px" }}>Potty Trained:</p>
                  {dog.isPottyTrained ? "Yes" : "No"}
                </p>
                <p className="modal-text ">
                  <p style={{ fontWeight: "500", display: "inline", marginRight: "7px" }}>Neutered:</p>
                  {dog.isNeutered ? "Yes" : "No"}
                </p>
                <p style={{ fontWeight: "500", fontSize: "17px", marginLeft: "5%", marginBottom: "2px" }}>Bio:</p>
                <p className="modal-text ">{dog.bio}</p>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="edit-prof-btn" onClick={() => setEditingDog(true)}>
                Update
              </Button>
              <Button className="edit-prof-btn" onClick={handleDeleteDog}>
                Delete
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}

export default DogProfile;
