import React from 'react';
import database from '../firebase/firebase';
import { connect } from 'react-redux'; 
import PlayerList from './PlayerList';
import { startLeaveSession, startStartGame } from '../actions/sessions';
import DrawArea from './DrawArea';

class LobbyPage extends React.Component {
    constructor() {
        super()
        this.state = {
            users: [],
            playing: false
        }
        this.handleLeave = this.handleLeave.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
    }
    componentDidMount() {
        database.ref(`sessions/${this.props.databaseCode}/users`).on('value', (snapshot) => {
            const newUsers = []
            snapshot.forEach((childSnapshot) => {
                newUsers.push(childSnapshot.val())
            })
            this.setState({users: newUsers})
        });
        database.ref(`sessions/${this.props.databaseCode}/playing`).on('value', (snapshot) => {
            this.setState({playing: snapshot.val()});
        })
        let length;
        database.ref(`sessions/${this.props.databaseCode}/length`).once('value').then((snapshot) => {
            length = snapshot.val() + 1;
        }).then(() => database.ref(`sessions/${this.props.databaseCode}`).update({length}))
    }

    componentWillUnmount() {
        let length;
        database.ref(`sessions/${this.props.databaseCode}/length`).once('value').then((snapshot) => {
            length = snapshot.val() - 1;
        }).then(() => database.ref(`sessions/${this.props.databaseCode}`).update({length}))
        this.props.startLeaveSession(this.props.databaseCode,this.props.userId)

    }

    handleLeave(e) {
        e.preventDefault();
        this.props.startLeaveSession(this.props.databaseCode,this.props.userId)
    }

    handleStart(e) {
        e.preventDefault()
        /*
        this.props.startStartGame();
        */
        database.ref(`sessions/${this.props.databaseCode}`).update({playing: true});
    }

    handleEnd(e) {
        e.preventDefault()
        
        database.ref(`sessions/${this.props.databaseCode}`).update({playing: false});
    }

    render() {
        return (
            <div>
                {this.state.playing ? <h1>Game Started </h1> : <h1>Waiting for players...</h1>}
                <p>Access code: {this.props.accessCode}</p>
                <PlayerList names={this.state.users}/>
                {this.state.playing && <DrawArea />}
                {this.state.playing ? <button onClick={this.handleEnd}>End Game</button> : <button onClick={this.handleStart}>Start Game</button>}
                <button onClick={this.handleLeave}> Leave Game</button>
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