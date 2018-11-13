import React, { Component, Fragment } from 'react';
import classNames from 'classnames';

import ModalWindow from './components/ModalWindow/index.js';
import ReadingList from './components/ReadingList/index.js';
import styles from './style.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      readings: null,
      activeReadings: null,
      activeReadingsCount: 0,
      unActiveReadingsCount: 0,
      error: false,
    }

    this.switchStatus = this.switchStatus.bind(this);
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
        this.setState({ error: false });
      })
      .catch(function(error) {
        console.warn('failed to fetch device readings', error);
        this.setState({ error: true });
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

  async switchStatus(e, name, status) {
    const { target } = e;
    const buttonText = target.innerHTML;
    target.innerHTML = 'Loading...';
    target.disabled = true;

    await fetch(`http://127.0.0.1:8888/device/${name}?active=${!status}`, {
        method: 'PATCH',
      })
      .then(response => {
        if (response.status >= 400 && response.status < 600) {
          console.warn('failed to patch new status');
          this.setState({ error: true });
          target.innerHTML = buttonText;
        }
        else {
          this.setState({ error: false });
          this.fetchDeviceReadings();
        }
      })
      .catch(function(error) {
        console.warn('failed to patch new status', error);
        this.setState({ error: true });
      })

    target.disabled = false;
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
    const { readings, activeReadings, activeReadingsCount, unActiveReadingsCount, error } = this.state;
    const readingList = activeReadings || readings;

    return (
      <Fragment>
        <h1 className={styles.title}>Device Dashboard</h1>
        <div>
          <div className={styles.statusBar}>
            <span className={styles.status}>
              Active: {activeReadingsCount}
            </span>
            <span className={classNames(styles.status, { isDisabled: activeReadings })}>
              <span className={activeReadings ? styles.hasActiveReadings : ''}>
                Unactive: {unActiveReadingsCount}</span>
            </span>
          </div>
          <div className={styles.searchForm}>
            <label htmlFor="status-search">Search active readings</label>
            <input
              className={styles.searchInput}
              type="text" role="search" name="status-search"
              onInput={e => this.searchActiveReadings(e)} />
          </div>
          {!readingList && (
            <div className={styles.isConnecting}>
              <span>Connecting to device...</span>
            </div>
          )}
          {readingList && !!readingList.length && (
            <ReadingList
              readingList={readingList}
              switchStatus={this.switchStatus} />
          )}
          {readingList && !readingList.length && (
            <div className={styles.messageBox}>
              <p>No device has been found...</p>
            </div>
          )}
        </div>
        {error && (
          <ModalWindow>
            <span>👨‍🔧 Something went wrong. Try again or report an error</span>
          </ModalWindow>
        )}
      </Fragment>
    );
  }
}

export default App;
