import React, { Component } from "react";
import ClockLive from "react-live-clock";
import Clock from "react-clock";
import axios from "axios";

import { Button, Form, FormGroup, Input } from "reactstrap";
import "./styles.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      cities: [],
      timezones: [],
      date: new Date()
    };

    this.handleClick = this.handleClick.bind(this);
    this.containsObject = this.containsObject.bind(this);
    this.removeTime = this.removeTime.bind(this);
  }

  componentDidMount() {
    axios.get("https://mehpd.sse.codesandbox.io/timezones").then(res => {
      const timezones = res.data;
      this.setState({
        cities: JSON.parse(localStorage.getItem("cities")) || [],
        timezones
      });
    });
    setInterval(() => this.setState({ date: new Date() }), 1000);
  }

  async handleClick(event) {
    let items = JSON.parse(localStorage.getItem("cities")) || [];
    let value = event.target.parentElement.children[0].value;
    const res = await axios.get("https://mehpd.sse.codesandbox.io/timezones");
    const itemMatched = res.data.find(item => item.value === value);

    if (!items.length) {
      items.push(itemMatched);
      localStorage.setItem("cities", JSON.stringify(items));
      this.setState({
        cities: JSON.parse(localStorage.getItem("cities"))
      });
      return;
    }

    const bolean = this.containsObject(itemMatched, items)[0];
    if (bolean) {
      return;
    } else {
      items.push(itemMatched);
      localStorage.setItem("cities", JSON.stringify(items));
    }

    this.setState({
      cities: JSON.parse(localStorage.getItem("cities"))
    });
  }

  async removeTime(event) {
    let items = JSON.parse(localStorage.getItem("cities"));
    let text = event.target.parentElement.children[0].textContent;
    let value = text.slice(0, text.length - 2);
    const res = await axios.get("https://mehpd.sse.codesandbox.io/timezones");
    const itemFinded = res.data.find(item => item.value === value);
    const index = this.containsObject(itemFinded, items)[1];
    let itemsRemoved = items.slice(0, index).concat(items.slice(index + 1));
    localStorage.setItem("cities", JSON.stringify(itemsRemoved));
    this.setState({
      cities: JSON.parse(localStorage.getItem("cities"))
    });
  }

  containsObject(item, items) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].name === item.name) {
        return [true, i];
      }
    }

    return false;
  }

  render() {
    const { cities, timezones } = this.state;

    return (
      <div className="App">
        <h1>Timezones</h1>
        <Form className="form">
          <FormGroup>
            <Input type="select" name="select">
              {timezones.map((timezone, index) => (
                <option key={index} value={timezone.value}>
                  {timezone.name}
                </option>
              ))}
            </Input>
            <Button color="primary" onClick={this.handleClick}>
              Add time
            </Button>
          </FormGroup>
        </Form>
        <Clock
          value={this.state.date}
        />
        <div className="App-clock">
          {cities.map((city, index) => (
            <div key={index} className="clock">
              <p>{city.value}: </p>
              <ClockLive
                format={"HH:mm:ss"}
                ticking={true}
                timezone={city.timezone}
              />
              <Button
                color="primary"
                className="button"
                onClick={this.removeTime}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
