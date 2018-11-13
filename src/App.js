import React, { Component } from 'react';
import classNames from 'classnames';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      readings: null,
      activeReadings: null,
      activeReadingsCount: 0,
      unActiveReadingsCount: 0,
    }
  }

  componentDidMount() {
    this.fetchDeviceReadings();
  }

  fetchDeviceReadings() {
    fetch('http://127.0.0.1:8888/device')
      .then(response => response.json())
      .then(({ data }) => {
        this.setState({ readings: data });
        this.updateCounters(data);
      })
      .catch(function(error) {
        console.warn('something went wrong...', error);
      })
  }

  updateCounters(readings) {
    const activeReadingsCount = readings.filter(reading => reading.active === true).length;
    const unActiveReadingsCount = readings.length - activeReadingsCount;

    this.setState({
      activeReadingsCount,
      unActiveReadingsCount,
    });
  }

  switchStatus(name, status) {
    fetch(`http://127.0.0.1:8888/device/${name}?active=${!status}`, {
        method: 'PATCH',
      })
      .then(() => {
        this.fetchDeviceReadings();
      })
      .catch(function(error) {
        console.warn('something went wrong...', error);
      })
  }

  searchActiveReadings(e) {
    const { readings } = this.state;
    const { value } = e.target;

    if (!value) {
      this.setState({
        activeReadings: null,
      })
      this.updateCounters(readings);
      return;
    }

    const activeReadings = readings.filter(reading => reading.name.indexOf(value) >= 0 && reading.active);

    this.setState({ activeReadings });
    this.updateCounters(activeReadings);
  }

  render() {
    const { readings, activeReadings, activeReadingsCount, unActiveReadingsCount } = this.state;
    const readingList = activeReadings || readings;

    return (
      <div className="readingList">
        <div className="statusBar">
          <span className="status">
            Active: {activeReadingsCount}
          </span>
          <span className={classNames('status', { isDisabled: activeReadings })}>
            Unactive: {unActiveReadingsCount}
          </span>
        </div>
        <div>
          <label htmlFor="status-search">Search active readings</label>
          <input
            type="text" role="search" name="status-search"
            onInput={e => this.searchActiveReadings(e)} />
        </div>
        {!readingList && <p>Connecting to device...</p>}
        {readingList && readingList.length && (
          <ul>
            {readingList.map(readings => (
              <li key={readings.name}>
                {Object.keys(readings).map(reading => (
                  <p key={`${readings.name}-${reading}`}>
                    {reading}: {readings[reading].toString()}
                  </p>
                ))}
                <button
                  className="statusSwitch"
                  onClick={() => this.switchStatus(readings.name, readings.active)}>
                  Turn {readings.active ? 'off' : 'on'}
                </button>
              </li>
            ))}
          </ul>
        )}
        {readingList && !readingList.length && <p>No device has been found...</p>}
      </div>
    );
  }
}

export default App;
