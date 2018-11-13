import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { keepDrawing, startDrawing, stopDrawing } from '../actions/drawarea'
import Drawing from './Drawing';


class DrawArea extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        return new Immutable.Map({
          x: mouseEvent.clientX - boundingRect.left,
          y: mouseEvent.clientY - boundingRect.top,
        });
    }
    
    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
    }
    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
    }
    handleMouseUp() {
        this.props.stopDrawing();
    }
    handleMouseDown(mouseEvent) {
        if (mouseEvent.button != 0) {
            return;
        }
        const point = this.relativeCoordinatesForEvent(mouseEvent);
        this.props.startDrawing(point);
    }
    handleMouseMove(mouseEvent) {
        if (!this.props.isDrawing) {
          return;
        }
        const point = this.relativeCoordinatesForEvent(mouseEvent);
        this.props.keepDrawing(point);
      }
    render() {
        return (
            <div className="drawArea" ref="drawArea" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove}>
            <Drawing lines={this.props.lines} />
            </div>);
    }
}
const mapStateToProps = (state) => {
    return {
        isDrawing: state.drawArea.isDrawing,
        lines: state.drawArea.lines
    };
};
const mapDispatchToProps = (dispatch) => ({
    startDrawing: (point) => dispatch(startDrawing(point)),
    keepDrawing: (point) => dispatch(keepDrawing(point)),
    stopDrawing: () => dispatch(stopDrawing())
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawArea);