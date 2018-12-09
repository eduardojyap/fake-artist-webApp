import React from 'react'
import Signature from './Signature';
import { Button } from 'react-bootstrap';
import { Header } from './Header';

class NewPage extends React.Component {
    constructor() {
        super();
        this.handleCreate = this.handleCreate.bind(this);
        this.handleJoin = this.handleJoin.bind(this);
    }
    handleCreate() {
        this.props.history.push('/create');
    }
    handleJoin() {
        this.props.history.push('/join');
    }
    render() {
        return (
            <div>
                    <Header/>
                    <div className="content-container content-center">
                        <div className="form__content">
                            <Button bsClass="btn btn-outline-dark btn-m button" onClick={this.handleCreate}>New Game</Button>
                            <Button bsClass="btn btn-outline-dark btn-m" onClick={this.handleJoin}>Join Game</Button>
                        </div>    
                    </div>
                    <Signature />
            </div>
        )
    }
} 

export default NewPage;