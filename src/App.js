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

    this.handleFormOnSubmit = this.handleFormOnSubmit.bind(this);
    this.handleSelectOnChange = this.handleSelectOnChange.bind(this);
    this.removeTime = this.removeTime.bind(this);
  }

  componentDidMount() {
    axios.get("https://mehpd.sse.codesandbox.io/timezones").then(res => {
      const timezones = res.data;
      this.setState({
        cities: JSON.parse(localStorage.getItem("cities")) || [],
        timezones,
        itemMatched: timezones[0]
      });
    });

    // localStorage.removeItem("cities");
    setInterval(() => this.setState({ date: new Date() }), 1000);
  }

  handleSelectOnChange(event) {
    const value = event.target.value;
    const { timezones } = this.state;
    const itemMatched = timezones.find(item => item.value === value);

    this.setState({
      itemMatched
    });
  }

  handleFormOnSubmit(event) {
    event.preventDefault();
    const items = JSON.parse(localStorage.getItem("cities")) || [];
    const { itemMatched } = this.state;

    if (!items.length) {
      items.push(itemMatched);
      localStorage.setItem("cities", JSON.stringify(items));
      this.setState({
        cities: JSON.parse(localStorage.getItem("cities"))
      });
      return;
    }

    const indexOfItem = items.findIndex(
      item => item.value === itemMatched.value
    );

    if (indexOfItem >= 0) {
      return;
    } else {
      items.push(itemMatched);
      localStorage.setItem("cities", JSON.stringify(items));
    }

    this.setState({
      cities: JSON.parse(localStorage.getItem("cities"))
    });
  }

  removeTime(event) {
    const items = JSON.parse(localStorage.getItem("cities"));
    const text = event.target.parentElement.children[0].textContent;
    const value = text.slice(0, text.length - 2);

    const itemMatched = items.find(item => item.value === value);
    const indexOfItem = items.findIndex(
      item => item.value === itemMatched.value
    );

    const itemsRemoved = items
      .slice(0, indexOfItem)
      .concat(items.slice(indexOfItem + 1));

    localStorage.setItem("cities", JSON.stringify(itemsRemoved));

    this.setState({
      cities: JSON.parse(localStorage.getItem("cities"))
    });
  }

  render() {
    const { cities, timezones, date } = this.state;

    return (
      <div className="App">
        <h1>Timezones</h1>
        <Form
          className="form"
          onSubmit={event => this.handleFormOnSubmit(event)}
        >
          <FormGroup>
            <Input
              type="select"
              name="select"
              onChange={event => this.handleSelectOnChange(event)}
            >
              {timezones.map((timezone, index) => (
                <option key={index} value={timezone.value}>
                  {timezone.name}
                </option>
              ))}
            </Input>
            <Button color="primary">Add time</Button>
          </FormGroup>
        </Form>
        <Clock value={date} />
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
                onClick={event => this.removeTime(event)}
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
