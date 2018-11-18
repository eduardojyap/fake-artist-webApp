import React from 'react';

class Player extends React.Component {
    render() {
        return <p className={this.props.color}>{this.props.name}</p>
    }
}

export default Player;