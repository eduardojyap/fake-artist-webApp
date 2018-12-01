import React from 'react'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { startJoinSession } from '../actions/sessions';
import { Header } from './Header';
import Signature from './Signature';
import { Button } from 'react-bootstrap';

class JoinPage extends React.Component {
    constructor() {
        super();
        this.state = {
            accessCode: '',
            name: '',
            errorMessage: ''
        }
        this.onNameChange = this.onNameChange.bind(this);
        this.onCodeChange = this.onCodeChange.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    
    onNameChange = (e) => {
        const name = e.target.value;
        if (name.length < 14) {
            this.setState(() => ({name}));
        }
    }

    onCodeChange = (e) => {
        const accessCode = e.target.value;
        if (accessCode.length < 7) {
            this.setState(() => ({accessCode}));
        }
    }

    onClick(e) {
        e.preventDefault();
        if (this.state.name && this.state.accessCode) {
            this.props.startJoinSession(this.state.name, this.state.accessCode).then(() => {
                this.props.history.push('/lobby');
            }).catch(() => {
                this.setState(()=>({errorMessage: "Match does not exist or already in progress."}))
            })
        }
    }

    handleBack(e) {
        e.preventDefault();
        this.props.history.push("/");
    }

    render() {
        return (
            <div>
                <Header />
                <div className="content-container content-center">
                    <div className="form__content">
                        {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
                        <div className="form__input">
                            <input className="form-control" placeholder="Enter access code" onChange={this.onCodeChange} value={this.state.accessCode}></input>
                        </div>
                        <div className="form__input">    
                            <input className="form-control" placeholder="Enter your name" onChange={this.onNameChange} value={this.state.name}></input>
                        </div>
                        <div className="form__buttons">
                            <Button bsClass="btn btn-outline-dark btn-m button" onClick={this.onClick}>Join</Button>
                            <Button bsClass="btn btn-outline-dark btn-m" onClick={this.handleBack}>Back</Button>
                        </div>
                    </div>
                </div>
                <Signature />
            </div>
        )
    } 
}

const mapDispatchToProps = (dispatch) => ({
    startJoinSession: (name,accessCode) => dispatch(startJoinSession(name,accessCode))
})

export default connect(undefined,mapDispatchToProps)(JoinPage);