import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      pos: null,
      titulo: "Nueva Serie",
      id: 0,
      nombre: "",
      fecha: "",
      rating: "0",
      categoria: "",
    };
    this.cambioNombre = this.cambioNombre.bind(this);
    this.cambioFecha = this.cambioFecha.bind(this);
    this.cambioRating = this.cambioRating.bind(this);
    this.cambioCategoria = this.cambioCategoria.bind(this);
    this.guardar = this.guardar.bind(this);
  }

  cambioNombre(e) {
    console.log();
    this.setState({
      nombre: e.target.value,
    });
  }

  cambioFecha(e) {
    this.setState({
      fecha: e.target.value,
    });
  }

  cambioRating(e) {
    this.setState({
      rating: e.target.value,
    });
  }

  cambioCategoria(e) {
    this.setState({
      categoria: e.target.value,
    });
  }

  componentDidMount() {
    axios.get("http://localhost:8000/serie/").then((res) => {
      console.log(res.data);
      this.setState({ series: res.data });
    });
  }

  guardar(e) {
    e.preventDefault();
    let cod = this.state.id;
    const datos = {
      name: this.state.nombre,
      release_date: this.state.fecha,
      rating: this.state.rating,
      category: this.state.categoria,
    };
    console.log(datos)
    if (cod > 0) {
      axios
        .put("http://localhost:8000/serie/" + cod, datos)
        .then((res) => {
          let indx = this.state.pos;
          this.state.series[indx] = res.data;
          var temp = this.state.series;
          this.setState({
            pos: null,
            titulo: "Nueva Serie",
            id: 0,
            nombre: "",
            fecha: "",
            rating: 0,
            categoria: "",
            series: temp,
          });
        })
        .catch((error) => {
          console.log(error.toString());
        });
    } else {
      axios
        .post("http://localhost:8000/serie/", datos)
        .then((res) => {
          this.state.series.push(res.data);
          var temp = this.state.series;
          this.setState({
            id: 0,
            nombre: "",
            fecha: "",
            rating: 0,
            categoria: "",
            series: temp,
          });
        })
        .catch((error) => {
          console.log(error.toString());
        });
    }
  }
  mostrar(id, index) {
    const serie = this.state.series[index];
    this.setState({
      pos: index,
      titulo: "Editar Serie",
      id: serie.id,
      nombre: serie.name,
      fecha: serie.release_date,
      rating: serie.rating,
      categoria: serie.category
    });
  }

  eliminar(id) {
    const serie = this.state.series.find(serie => serie.id === id);
    const confirmarEliminar = window.confirm(`¿Deseas eliminar la serie "${serie.name}"?`);
    if (confirmarEliminar) {
      axios.delete("http://localhost:8000/serie/" + id)
        .then(() => {
          const series = this.state.series.filter(serie => serie.id !== id);
          this.setState({ series });
        })
        .catch(error => {
          console.log(error.toString());
        });
    }
  }  

  render() {
    return (
      <Container>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Rating</th>
              <th>Categoria</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.series.map((serie, index) => {
              return (
                <tr key={serie.id}>
                  <td>{serie.id}</td>
                  <td>{serie.name}</td>
                  <td>{serie.release_date}</td>
                  <td>{serie.rating}</td>
                  <td>{serie.category}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => this.mostrar(serie.id, index)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => this.eliminar(serie.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <hr />
        <h1>{this.state.titulo}</h1>
        <Form onSubmit={this.guardar}>
          <Form.Control type="hidden" value={this.state.id} />
          <Form.Group className="mb-3">
            <Form.Label>Ingrese Nombre:</Form.Label>
            <Form.Control
              type="text"
              value={this.state.nombre}
              onChange={this.cambioNombre}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ingrese Rating:</Form.Label>
            <Form.Control
              type="number"
              value={this.state.rating}
              onChange={this.cambioRating}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoria:</Form.Label>
            <Form.Control
              type="text"
              value={this.state.categoria}
              onChange={this.cambioCategoria}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha:</Form.Label>
            <Form.Control
              type="date"
              value={this.state.fecha}
              onChange={this.cambioFecha}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            GUARDAR
          </Button>
        </Form>
      </Container>
    );
  }
}

export default App;