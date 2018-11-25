import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startCreateSession } from '../actions/sessions'
import { addPlayer } from '../actions/players'

class CreatePage extends React.Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onRoundsChange = this.onRoundsChange.bind(this);
        this.state = {
            name: ''
        }
    }
    onNameChange = (e) => {
        const name = e.target.value;
        this.setState(() => ({name}));
    }
    onClick(e) {
        e.preventDefault();
        if (this.state.name) {
            this.props.startCreateSession(this.state.name).then(() => {
                this.props.history.push('/lobby');
            }
            )
        }
    }
    onRoundsChange(e) {
        const rounds = e.target.value;
        if (!rounds || rounds.match(/\b[1-9]\b/)) {
            this.setState(()=>({rounds}));
        }
    }
    render() {
        return (    
            <div>
                <input placeholder="Enter your name" onChange={this.onNameChange}></input>
                {/*<p># of rounds<input value={this.state.rounds} onChange={this.onRoundsChange}></input></p>*/}
                <button onClick={this.onClick}>Create</button>
                <Link to="/">Back</Link>
            </div>
        )
    }
}
const mapDispatchToProps = (dispatch) => ({
    startCreateSession: (name) => dispatch(startCreateSession(name)),
    addPlayer: (name) => dispatch(addPlayer(name))
})

export default connect(undefined,mapDispatchToProps)(CreatePage);