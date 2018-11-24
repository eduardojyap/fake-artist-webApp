import React from 'react';
import Player from './player'

class PlayerList extends React.Component {
    render() {
        console.log(this.props.users)
        return (
            <div>
                {this.props.users.map((user, index) => (<div key={index}><Player name={user.name} />{(this.props.turn === user.index) && " - your turn"}</div>))}
            </div>
        )
    }
}

export default PlayerList;