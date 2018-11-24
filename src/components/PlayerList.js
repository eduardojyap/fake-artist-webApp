import React from 'react';
import { connect } from 'react-redux';
import Player from './player'
import database from '../firebase/firebase'

class PlayerList extends React.Component {
    render() {
        return (
            <div>
                {this.props.users.map((user, index) => (<div key={index}><Player name={user.name} />{this.props.turn && " - your turn"}</div>))}
            </div>
        )
    }
}

export default PlayerList;