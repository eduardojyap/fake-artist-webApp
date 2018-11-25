import React from 'react';
import database from '../firebase/firebase';
import { connect } from 'react-redux'; 
import PlayerList from './PlayerList';
import { startLeaveSession,setTurnId } from '../actions/sessions';
import { startRemoveLines, removeLines } from '../actions/drawarea';
import items from '../items';
import DrawArea from './DrawArea';
import CategoryObject from './CategoryObject'

class LobbyPage extends React.Component {
    constructor() {
        super()
        this.state = {
            users: [],
            playing: false,
            turn: false,
            turnId: -1,
            category: '',
            name:''
        }
        this.handleLeave = this.handleLeave.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        database.ref(`sessions/${this.props.databaseCode}/indices`).off()
        database.ref(`sessions/${this.props.databaseCode}/playing`).off();
        database.ref(`sessions/${this.props.databaseCode}/turn`).off();
        database.ref(`sessions/${this.props.databaseCode}/object`).off();
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
        window.addEventListener('beforeunload', this.componentCleanup);
        database.ref(`sessions/${this.props.databaseCode}/turn`).on('value', (snapshot) => {
            this.setState({turnId: snapshot.val()});
            if (snapshot.val() == this.props.userId) {
                this.setState({turn: true});
            } else if (this.state.turn == true) {
                this.setState({turn: false});
            }
        })
        database.ref(`sessions/${this.props.databaseCode}/object`).on('value', (snapshot) => {
            const object = snapshot.val();
            if (object !== null) {
                if (object.spy === this.props.userId) {
                    this.setState({category:object.category,name:''})
                } else {
                    this.setState({category: object.category, name: object.name})
                }
            }
        });
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    handleLeave(e) {
        e.preventDefault();
        this.props.startLeaveSession(this.props.databaseCode,this.props.userId);
        this.props.removeLines();
    }

    handleStart(e) {
        e.preventDefault()
        const i = Math.floor(Math.random() * items.length);
        const spy = Math.floor(Math.random() * this.state.users.length);
        database.ref(`sessions/${this.props.databaseCode}/object`).set({...items[i], spy}).then(() => {
            database.ref(`sessions/${this.props.databaseCode}`).update({playing: true})
        })
    }

    handleEnd(e) {
        e.preventDefault()
        database.ref(`sessions/${this.props.databaseCode}`).update({playing: false, turn: -1})
        this.props.startRemoveLines(this.props.databaseCode);
    }

    render() {
        return (
            <div>
                {this.state.playing ? <h1>Game Started </h1> : <h1>Waiting for players...</h1>}
                <p>Access code: {this.props.accessCode}</p>
                {this.state.playing && <CategoryObject category={this.state.category} name={this.state.name}/>}
                <PlayerList turn={this.state.turn} users={this.state.users} playing={this.state.playing} turnId={this.state.turnId}/>
                {this.state.playing && <DrawArea turn={this.state.turn} turnId={this.state.turnId}/>}
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
        startRemoveLines: (databaseCode) => dispatch(startRemoveLines(databaseCode)),
        removeLines: () => dispatch(removeLines()),
        startLeaveSession: (databaseCode,userId) => dispatch(startLeaveSession(databaseCode,userId)),
        setTurnId: (turnId) => dispatch(setTurnId(turnId))
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(LobbyPage);