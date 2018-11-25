import React from 'react';

export default class DrawingLine extends React.Component {
  render() {
      const pathData = "M " +
      this.props.line
        .map(p => {
          return `${p.get('x')} ${p.get('y')}`;
        })
        .join(" L ");
    return <path className={`player-${this.props.turnId+1}`} d={pathData} />;
  }
}