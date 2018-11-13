import React from 'react';

function ReadingItem({ readings, switchStatus }) {
  return (
    <li>
      {Object.keys(readings).map(reading => (
        <p key={`${readings.name}-${reading}`}>
          {reading}: {readings[reading].toString()}
        </p>
      ))}
      <button
        className="statusSwitch"
        onClick={(e) => switchStatus(e, readings.name, readings.active)}
        disabled={readings.active ? false : false}>
        {readings.active ? 'Turn off' : 'Turn on'}
      </button>
    </li>
  )
}

function ReadingList(props) {
  return (
    <ul>
      {props.readingList.map(readings => (
        <ReadingItem key={readings.name} readings={readings} {...props} />
      ))}
    </ul>
  )
}

export default ReadingList;
