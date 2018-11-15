import React from 'react'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { startJoinSession } from '../actions/sessions';

class JoinPage extends React.Component {
    constructor() {
        super();
        this.state = {
            accessCode: '',
            name: ''
        }
        this.onNameChange = this.onNameChange.bind(this);
        this.onCodeChange = this.onCodeChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    onNameChange = (e) => {
        const name = e.target.value;
        this.setState(() => ({name}));
    }
    onCodeChange = (e) => {
        const accessCode = e.target.value;
        this.setState(() => ({accessCode}));
    }
    onClick(e) {
        e.preventDefault();
        if (this.state.name && this.state.accessCode) {
            this.props.startJoinSession(this.state.name, this.state.accessCode).then(() => {
                this.props.history.push('/lobby');
            }).catch(() => {
            })
        }
    }
    render() {
        return (
            <div>
                <input placeholder="Enter access code" onChange={this.onCodeChange}></input>
                <input placeholder="Enter name" onChange={this.onNameChange}></input>
                <button onClick={this.onClick}>Join</button>
                <Link to="/">Back</Link>
            </div>
        )
    } 
}

const mapDispatchToProps = (dispatch) => ({
    startJoinSession: (name,accessCode) => dispatch(startJoinSession(name,accessCode))
})

export default connect(undefined,mapDispatchToProps)(JoinPage);