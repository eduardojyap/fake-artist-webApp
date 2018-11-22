import React from 'react';
import { connect } from 'react-redux';
import Player from './player'
import database from '../firebase/firebase'

class PlayerList extends React.Component {
    render() {
        return (
            <div>
                {this.props.users.map((user, index) => (<Player key={index} name={user.name} />))}
            </div>
        )
    }
}

export default PlayerList;