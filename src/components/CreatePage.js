import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startCreateSession } from '../actions/sessions'
import { addPlayer } from '../actions/players'
import { Header } from './Header';
import Signature from './Signature';
import { Button } from 'react-bootstrap';

class CreatePage extends React.Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onRoundsChange = this.onRoundsChange.bind(this);
        this.handleBack = this.handleBack.bind(this);
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
                        <div className="form__input">
                            <input className="form-control" placeholder="Enter your name" onChange={this.onNameChange}></input>
                        </div>
                        <div className="form__buttons">
                            <Button bsClass="btn btn-outline-dark btn-m button" onClick={this.onClick}>Create</Button>
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
    startCreateSession: (name) => dispatch(startCreateSession(name)),
    addPlayer: (name) => dispatch(addPlayer(name))
})

export default connect(undefined,mapDispatchToProps)(CreatePage);