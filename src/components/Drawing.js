import React from 'react';
import DrawingLine from './DrawingLine';
import { connect } from 'react-redux';

class Drawing extends React.Component {
        
        render() {
        return (
            <svg className = "drawing">
                {this.props.lines.map((line, index) => (
                    <DrawingLine key={index} line={line.line} turnId={line.turnId}/>
                ))}
                {this.props.line.size > 0 && <DrawingLine line={this.props.line} turnId={this.props.userId}/>}
            </svg>
        )
    }
}

const mapStateToProps = (state) => ({
    lines: state.drawArea.lines,
    userId: state.sessions.userId
})

export default connect(mapStateToProps)(Drawing);