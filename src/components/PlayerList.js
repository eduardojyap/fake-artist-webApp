import React from 'react';
import { connect } from 'react-redux';
import { addPlayer } from '../actions/players'

class PlayerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.name !== "") {
            this.props.addPlayer(this.state.name);
        }
    }
    onNameChange = (e) => {
        const name = e.target.value;
        this.setState(() => ({name}));
    }
    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input placeholder="Player Name" onChange={this.onNameChange}></input>
                    <button>Add player</button>
                </form>
                {this.props.players.map((player,index) => (
                    <p key={index}>{player.name}</p>
                ))}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    players: state.players
});
const mapDispatchToProps = (dispatch) => ({
    addPlayer: (name) => dispatch(addPlayer(name))
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayerList);