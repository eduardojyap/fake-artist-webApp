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
        this.componentCleanup = this.componentCleanup.bind(this);
    }
    componentCleanup() {
        let length;
        database.ref(`sessions/${this.props.databaseCode}/length`).once('value').then((snapshot) => {
            length = snapshot.val() - 1;
        }).then(() => database.ref(`sessions/${this.props.databaseCode}`).update({length}))
        database.ref(`sessions/${this.props.databaseCode}/indices`).off()
        database.ref(`sessions/${this.props.databaseCode}/playing`).off();
        this.props.startLeaveSession(this.props.databaseCode,this.props.userId);
    }
    componentDidMount() {
        database.ref(`sessions/${this.props.databaseCode}/indices`).on('value', (snapshot) => {
            const newUsers = []
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().name !== undefined) {
                    newUsers.push(childSnapshot.val())
                }
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
        window.addEventListener('beforeunload', this.componentCleanup);
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
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
        let order = [0,1,2,3,4,5,6,7,8,9];
        order = order.sort( () => Math.random() - 0.5)
        database.ref(`sessions/${this.props.databaseCode}/indices/`).once('value').then( (snapshot) => {
            database.ref(`sessions/${this.props.databaseCode}/indices/`).update({
                0:snapshot.child(order[0]).val(),
                1:snapshot.child(order[1]).val(),
                2:snapshot.child(order[2]).val(),
                3:snapshot.child(order[3]).val(),
                4:snapshot.child(order[4]).val(),
                5:snapshot.child(order[5]).val(),
                6:snapshot.child(order[6]).val(),
                7:snapshot.child(order[7]).val(),
                8:snapshot.child(order[8]).val(),
                9:snapshot.child(order[9]).val()
            })
        }).then(() => {
            database.ref(`sessions/${this.props.databaseCode}`).update({playing: true});
        })        
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
                <PlayerList users={this.state.users} playing={this.state.playing}/>
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