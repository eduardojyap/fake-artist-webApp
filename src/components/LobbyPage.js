import React from 'react';
import database from '../firebase/firebase';
import { connect } from 'react-redux'; 
import PlayerList from './PlayerList';
import { startLeaveSession,setTurnId } from '../actions/sessions';
import { startRemoveLines, removeLines } from '../actions/drawarea';
import items from '../items';
import DrawArea from './DrawArea';
import CategoryObject from './CategoryObject'
import { Button } from 'react-bootstrap';
import LoadingPage from './LoadingPage';

class LobbyPage extends React.Component {
    constructor() {
        super()
        this.state = {
            users: [],
            playing: false,
            turn: false,
            turnId: -1,
            category: '',
            name:'',
            loading:false
        }
        this.handleLeave = this.handleLeave.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        const databaseCode = this.props.databaseCode;
        this.props.startLeaveSession(this.props.databaseCode,this.props.userId).then(() => {
            database.ref(`sessions/${databaseCode}/indices`).off()
            database.ref(`sessions/${databaseCode}/playing`).off();
            database.ref(`sessions/${databaseCode}/turn`).off();
            database.ref(`sessions/${databaseCode}/object`).off();
        });
        database.ref(`sessions/${this.props.databaseCode}/turn`).once('value').then((snapshot) => {
            const index = snapshot.val();
            if (index === this.props.userId) {
                database.ref(`sessions/${this.props.databaseCode}/lines`).push(null);
            }
        })
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
            this.setState((prevState) => {
                if (!prevState.playing) {
                    this.props.removeLines();
                }
                return {playing: snapshot.val()};
            })
        })
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault()
            this.componentCleanup();
        });
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
        this.setState(()=>({loading:true}))
        const i = Math.floor(Math.random() * items.length);
        const spy = Math.floor(Math.random() * this.state.users.length);
        database.ref(`sessions/${this.props.databaseCode}/object`).set({...items[i], spy}).then(() => {
            database.ref(`sessions/${this.props.databaseCode}`).update({playing: true})
            this.setState(()=>({loading:false}))
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
                {this.state.playing ? <CategoryObject category={this.state.category} name={this.state.name}/> : 
                <div className="content-container">
                    <div className="header__content">
                        <h1 className="header__title">Waiting for players...</h1>
                    </div>
                    <p>Access code: {this.props.accessCode}</p>
                </div>}
                {this.state.loading && <LoadingPage/>}
                <PlayerList turn={this.state.turn} users={this.state.users} playing={this.state.playing} turnId={this.state.turnId}/>
                {this.state.playing && <DrawArea turn={this.state.turn} turnId={this.state.turnId}/>}
                <div className="content-container content-center">
                    <div className="form__content__top">
                        {this.state.playing ? <Button bsClass="btn btn-outline-dark btn-m button" onClick={this.handleEnd}>End Game</Button> : <Button bsClass="btn btn-outline-dark btn-m button" onClick={this.handleStart}>Start Game</Button>}
                        <Button bsClass="btn btn-outline-dark btn-m" onClick={this.handleLeave}> Leave Game</Button>
                    </div>
                </div>
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