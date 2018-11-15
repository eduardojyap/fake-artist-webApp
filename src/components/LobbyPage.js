import React from 'react';
import database from '../firebase/firebase';
import { connect } from 'react-redux'; 
import Player from './player';
import { startLeaveSession } from '../actions/sessions'

class LobbyPage extends React.Component {
    constructor() {
        super()
        this.state = {
            names: []
        }
        this.handleLeave = this.handleLeave.bind(this);
    }
    componentDidMount() {
        database.ref(`sessions/${this.props.databaseCode}/users`).on('value', (snapshot) => {
            const newNames = []
            snapshot.forEach((childSnapshot) => {
                newNames.push(childSnapshot.val())
            })
            this.setState({names: newNames})
        });
    }

    handleLeave(e) {
        e.preventDefault();
        this.props.startLeaveSession(this.props.databaseCode,this.props.userId)
    }

    render() {
        return (
            <div>
                <h1>Waiting for players...</h1>
                <p>Access code: {this.props.accessCode}</p>
                {this.state.names.map((name, index) => (<Player key={index} name={name} />))}
                <button>Start Game</button>
                <button onClick={this.handleLeave}>Leave Game</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        accessCode: state.sessions.accessCode,
        databaseCode: state.sessions.databaseCode,
        userId: state.sessions.userId
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        startLeaveSession: (databaseCode,userId) => dispatch(startLeaveSession(databaseCode,userId))
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(LobbyPage);