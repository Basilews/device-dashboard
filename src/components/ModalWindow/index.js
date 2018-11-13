import React, { Component } from 'react';
import classNames from 'classnames';

import styles from './style.css';


class ModalWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHidden: false,
    }
  }

  componentDidMount() {
    setTimeout(() => this.hideMessage(), 2100);
  }

  hideMessage() {
    this.setState({ isHidden: true });
  }

  render() {
    const { isHidden } = this.state;
    console.log(isHidden);

    return (
      <div
        className={classNames(styles.modal, isHidden ? styles.isHidden : '')}>
        {this.props.children}
      </div>
    )
  }
};

export default ModalWindow;
