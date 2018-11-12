import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: null,
      activeDevicesCount: 0,
      unActiveDevicesCount: 0,
    }
  }

  componentDidMount() {
    this.fetchDevices();
  }

  fetchDevices() {
    fetch('http://127.0.0.1:8888/device')
      .then(response => response.json())
      .then(({ data }) => {
        this.setState({ devices: data });
        this.updateCounters(data);
      })
      .catch(function() {
        console.warn('something went wrong...');
      })
  }

  updateCounters(devices) {
    const activeDevicesCount = devices.filter(device => device.active === true).length;
    const unActiveDevicesCount = devices.length - activeDevicesCount;

    this.setState({
      activeDevicesCount,
      unActiveDevicesCount,
    });
  }

  render() {
    const { devices, activeDevicesCount, unActiveDevicesCount } = this.state;

    return (
      <div className="deviceList">
        <div className="statusBar">
          <span className="status">
            Active: {activeDevicesCount}
          </span>
          <span className="status">
            Unactive: {unActiveDevicesCount}
          </span>
        </div>
        {devices && devices.length
          ? (
            <ul>
              {devices.map(device => (
                <li key={device.name}>
                  {Object.keys(device).map(reading => (
                    <p key={`${device.name}-${reading}`}>
                      {reading}: {device[reading].toString()}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          )
          : <p>Connecting to device...</p>
        }
      </div>
    );
  }
}

export default App;
