import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Signature from './Signature';
import LoadingPage from './LoadingPage'
import { startCreateSession } from '../actions/sessions'
import { Header } from './Header';



class CreatePage extends React.Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onRoundsChange = this.onRoundsChange.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.state = {
            name: '',
            loading: false
        }
    }
    onNameChange = (e) => {
        const name = e.target.value;
        if (name.length < 14) {
            this.setState(() => ({name}));
        }
    }
    onClick(e) {
        e.preventDefault();
        this.setState(() => ({loading: true}))
        if (this.state.name) {
            this.props.startCreateSession(this.state.name).then(() => {
                this.setState(() => ({loading: false}))
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
                {this.state.loading && <LoadingPage/>}
                <div className="content-container content-center">
                    <div className="form__content">
                        
                        <div className="form__input">
                            <input className="form-control" placeholder="Enter your name" onChange={this.onNameChange} value={this.state.name}></input>
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
    startCreateSession: (name) => dispatch(startCreateSession(name))
})

export default connect(undefined,mapDispatchToProps)(CreatePage);