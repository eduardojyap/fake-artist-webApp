import React from 'react';

class Player extends React.Component {
    render() {
        return <p><span className={`fontcolor-${this.props.index+1}`}>■</span>{this.props.name}</p>
    }
}

export default Player;