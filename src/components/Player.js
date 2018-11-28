import React from 'react';

class Player extends React.Component {
    render() {
        return (
            <div className={"player " + ((this.props.playing && (this.props.turnId === this.props.index)) && "turn")}>
                <span className={`fontcolor-${this.props.index+1}`}>■</span>{this.props.name}
            </div>
        )
    }
}

export default Player;