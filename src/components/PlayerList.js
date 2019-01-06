import React from 'react';
import Player from './Player'

class PlayerList extends React.Component {
    render() {
        return (
            <div className="content-container content-center">
                <div className="playerlist">
                    {this.props.users.map((user, index) => (
                        <Player key={index} name={user.name} index={user.index} playing={this.props.playing} turnId={this.props.turnId} qm={this.props.qm}/>))}
                </div>
            </div>
        )
    }
}

export default PlayerList;