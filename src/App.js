import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

function MyComponent() {
  const [clientList, setClientList] = useState([]);
  const [modalView, setModalView] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [suite, setSuite] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [catchPhrase, setCatchPhrase] = useState("");
  const [bs, setBs] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const jsonData = await response.json();
      setClientList(jsonData);
      // Update local storage after fetching data
      updateLocalStorage(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateLocalStorage = (data) => {
    localStorage.setItem("clientList", JSON.stringify(data));
  };

  // fetchData();

  useEffect(() => {
    // Load client list from local storage on component mount
    const storedClients = localStorage.getItem("clientList");
    if (storedClients) {
      try {
        setClientList(JSON.parse(storedClients));
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    } else {
      // If no data is in local storage, fetch it from the API
      fetchData();
    }
  }, []);

  // Function to view the Client's detail
  const toggleViewModal = () => {
    setModalView(!modalView);
  };

  const viewClientDetails = (client) => {
    setSelectedClient(client);
    toggleViewModal();
  };

  // CRUD

  // Function to add a new client
  const toggleAddModal = () => {
    setModalAdd(!modalAdd);
  };

  const addClient = (newClient) => {
    const updatedClientList = [...clientList, newClient];
    setClientList(updatedClientList);
    updateLocalStorage(updatedClientList);
    toggleAddModal();
  };

  const handleFormAdd = (e) => {
    e.preventDefault();
    const newClient = {
      id: clientList.length + 1,
      name: name,
      username: username,
      email: email,
      address: {
        street: street,
        suite: suite,
        city: city,
        zipcode: zipcode,
        geo: {
          lat: lat,
          lng: lng,
        },
      },
      phone: phone,
      website: website,
      company: {
        name: companyName,
        catchPhrase: catchPhrase,
        bs: bs,
      },
    };
    addClient(newClient);
    toggleAddModal();
  };

  // Function to edit a client
  const toggleEditModal = () => {
    setModalEdit(!modalEdit);
  };

  const editClientDetails = (client) => {
    setSelectedClient(client);
    setName(client.name);
    setUserName(client.username);
    setEmail(client.email);
    setStreet(client.address.street);
    setSuite(client.address.suite);
    setCity(client.address.city);
    setZipcode(client.address.zipcode);
    setLat(client.address.geo.lat);
    setLng(client.address.geo.lng);
    setPhone(client.phone);
    setWebsite(client.website);
    setCompanyName(client.company.name);
    setCatchPhrase(client.company.catchPhrase);
    setBs(client.company.bs);
    toggleEditModal();
  };

  const handleFormEdit = (e) => {
    e.preventDefault();
    // Update the client list with the edited client
    const updatedClientList = clientList.map((client) =>
      client.id === selectedClient.id
        ? {
            ...client,
            name,
            username,
            email,
            address: {
              street,
              suite,
              city,
              zipcode,
              geo: {
                lat,
                lng,
              },
            },
            phone,
            website,
            company: {
              name: companyName,
              catchPhrase,
              bs,
            },
          }
        : client
    );

    setClientList(updatedClientList);
    updateLocalStorage(updatedClientList);
    toggleEditModal();
  };

  // Function to delete a client
  const deleteClient = (id) => {
    const updatedClientList = clientList.filter((client) => client.id !== id);
    setClientList(updatedClientList);
    updateLocalStorage(updatedClientList);
  };

  return (
    <Card>
      {/* View Clients */}
      <CardBody>
        <Row>
          <Col>
            <CardTitle tag="h0">Client List</CardTitle>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button color="primary" onClick={toggleAddModal}>
              Add
            </Button>
          </Col>
        </Row>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>UserName</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {clientList.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.username}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>
                  <Button
                    color="info"
                    onClick={() => viewClientDetails(client)}
                  >
                    Details
                  </Button>
                  <Button
                    color="warning"
                    onClick={() => editClientDetails(client)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => deleteClient(client.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>

      {/* View Client Details */}
      <Modal isOpen={modalView} toggle={toggleViewModal}>
        <ModalHeader toggle={toggleViewModal}>Client Details</ModalHeader>
        <ModalBody>
          {selectedClient && (
            <>
              <p>
                <strong>Name:</strong> {selectedClient.name}
              </p>
              <p>
                <strong>Username:</strong> {selectedClient.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedClient.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedClient.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedClient.address.street}{" "}
                {selectedClient.address.suite} {selectedClient.address.city}{" "}
                {selectedClient.address.zipcode}
              </p>
              <p>
                <strong>Website:</strong> {selectedClient.website}
              </p>
              <p>
                <strong>Company:</strong> {selectedClient.company.name}{" "}
              </p>
              <p>
                <strong>Catch Phrase:</strong>
                {selectedClient.company.catchPhrase}
              </p>
              <p>
                <strong>BS:</strong>
                {selectedClient.company.bs}{" "}
              </p>
            </>
          )}
        </ModalBody>
      </Modal>

      {/* Modal Add new Client */}
      <Modal isOpen={modalAdd} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add Client</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleFormAdd}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                onChange={(e) => setName(e.target.value)}
                id="name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                onChange={(e) => setUserName(e.target.value)}
                id="username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                id="email"
              />
            </FormGroup>
            <FormGroup>
              <Label for="street">Street</Label>
              <Input
                type="text"
                onChange={(e) => setStreet(e.target.value)}
                id="street"
              />
            </FormGroup>
            <FormGroup>
              <Label for="suite">Suite</Label>
              <Input
                type="text"
                onChange={(e) => setSuite(e.target.value)}
                id="suite"
              />
            </FormGroup>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
                type="text"
                onChange={(e) => setCity(e.target.value)}
                suiteid="city"
              />
            </FormGroup>
            <FormGroup>
              <Label for="zipcode">Zipcode</Label>
              <Input
                type="text"
                onChange={(e) => setZipcode(e.target.value)}
                suiteid="zipcode"
              />
            </FormGroup>
            <FormGroup>
              <Label for="lat">Lat</Label>
              <Input
                type="text"
                onChange={(e) => setLat(e.target.value)}
                id="lat"
              />
            </FormGroup>
            <FormGroup>
              <Label for="lng">Lng</Label>
              <Input
                type="text"
                onChange={(e) => setLng(e.target.value)}
                id="lng"
              />
            </FormGroup>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
                id="phone"
              />
            </FormGroup>
            <FormGroup>
              <Label for="website">Website</Label>
              <Input
                type="text"
                onChange={(e) => setWebsite(e.target.value)}
                id="website"
              />
            </FormGroup>
            <FormGroup>
              <Label for="companyName">Company</Label>
              <Input
                type="text"
                onChange={(e) => setCompanyName(e.target.value)}
                id="companyName"
              />
            </FormGroup>
            <FormGroup>
              <Label for="catchPhrase">Catch Phrase</Label>
              <Input
                type="text"
                onChange={(e) => setCatchPhrase(e.target.value)}
                id="catchPhrase"
              />
            </FormGroup>
            <FormGroup>
              <Label for="bs">BS</Label>
              <Input
                type="text"
                onChange={(e) => setBs(e.target.value)}
                id="bs"
              />
            </FormGroup>
            <Button color="primary" type="submit">
              Save
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Modal Edit Client */}
      <Modal isOpen={modalEdit} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Client</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleFormEdit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                id="username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
              />
            </FormGroup>
            <FormGroup>
              <Label for="street">Street</Label>
              <Input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                id="street"
              />
            </FormGroup>
            <FormGroup>
              <Label for="suite">Suite</Label>
              <Input
                type="text"
                value={suite}
                onChange={(e) => setSuite(e.target.value)}
                id="suite"
              />
            </FormGroup>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                suiteid="city"
              />
            </FormGroup>
            <FormGroup>
              <Label for="zipcode">Zipcode</Label>
              <Input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                suiteid="zipcode"
              />
            </FormGroup>
            <FormGroup>
              <Label for="lat">Lat</Label>
              <Input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                id="lat"
              />
            </FormGroup>
            <FormGroup>
              <Label for="lng">Lng</Label>
              <Input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                id="lng"
              />
            </FormGroup>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="phone"
              />
            </FormGroup>
            <FormGroup>
              <Label for="website">Website</Label>
              <Input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                id="website"
              />
            </FormGroup>
            <FormGroup>
              <Label for="companyName">Company</Label>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                id="companyName"
              />
            </FormGroup>
            <FormGroup>
              <Label for="catchPhrase">Catch Phrase</Label>
              <Input
                type="text"
                value={catchPhrase}
                onChange={(e) => setCatchPhrase(e.target.value)}
                id="catchPhrase"
              />
            </FormGroup>
            <FormGroup>
              <Label for="bs">BS</Label>
              <Input
                type="text"
                value={bs}
                onChange={(e) => setBs(e.target.value)}
                id="bs"
              />
            </FormGroup>
            <Button color="primary" type="submit">
              Save
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Card>
  );
}

export default MyComponent;
