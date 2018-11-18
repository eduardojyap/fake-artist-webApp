import React from 'react';
import DrawArea from './DrawArea';
import PlayerList from './PlayerList';
import { connect } from 'react-redux';

class DrawPage extends React.Component {
    render() {
        return (
            <div>
                <p>{this.props.accessCode}</p>
                <PlayerList/>
                <DrawArea />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    accessCode: state.sessions.accessCode
})

export default connect(mapStateToProps)(DrawPage);