import React from 'react';
import Player from './player'

class PlayerList extends React.Component {
    render() {
        return (
            <div>
                {this.props.users.map((user, index) => (
                    <div key={index}>
                    <Player name={user.name} index={user.index}/>
                    {(this.props.playing && (this.props.turnId === user.index)) && " - your turn"}
                    </div>))}
            </div>
        )
    }
}

export default PlayerList;