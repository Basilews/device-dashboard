import React from 'react';

import styles from './style.css';


function ReadingItem({ readings, switchStatus }) {
  return (
    <li className={styles.readingListItem}>
      {Object.keys(readings).map(reading => (
        <p key={`${readings.name}-${reading}`}>
          <span className={styles.reading}>{reading}:</span>&nbsp;
          {reading === 'active'
            ? (
              <span className={styles[readings[reading] ? 'isActive' : 'isUnActive']}>
                {readings[reading].toString()}
              </span>
            )
            : readings[reading].toString()
          }
        </p>
      ))}
      <button
        className={styles.statusSwitch}
        onClick={(e) => switchStatus(e, readings.name, readings.active)}
        disabled={readings.active ? false : false}>
        {readings.active ? 'Turn off' : 'Turn on'}
      </button>
    </li>
  )
}

function ReadingList(props) {
  return (
    <ul className={styles.readingList}>
      {props.readingList.map(readings => (
        <ReadingItem key={readings.name} readings={readings} {...props} />
      ))}
    </ul>
  )
}

export default ReadingList;
