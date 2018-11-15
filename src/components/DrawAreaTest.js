import React from 'react';
import Immutable from 'immutable';
import Drawing from './Drawing';
import { addLine } from '../actions/drawarea';
import { connect } from 'react-redux';
import PlayerList from './PlayerList';

class DrawArea extends React.Component {
    constructor() {
      super();
  
      this.state = {
        currentLine: new Immutable.List(),
        isDrawing: false
      };
  
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.onClick = this.onClick.bind(this);
    }
  
    componentDidMount() {
      document.addEventListener("mouseup", this.handleMouseUp);
    }
  
    componentWillUnmount() {
      document.removeEventListener("mouseup", this.handleMouseUp);
    }
  
    handleMouseDown(mouseEvent) {
      if (mouseEvent.button != 0) {
        return;
      }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
  
      this.setState(prevState => ({
        currentLine: prevState.currentLine.clear().push(point),
        isDrawing: true
      }));
    }
  
    handleMouseMove(mouseEvent) {
      if (!this.state.isDrawing) {
        return;
      }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
      
      this.setState(prevState =>  ({
        currentLine: prevState.currentLine.push(point)
      }));
    }
  
    handleMouseUp() {
      this.setState({ isDrawing: false });
    }
  
    relativeCoordinatesForEvent(mouseEvent) {
      const boundingRect = this.refs.drawArea.getBoundingClientRect();
      return new Immutable.Map({
        x: mouseEvent.clientX - boundingRect.left,
        y: mouseEvent.clientY - boundingRect.top,
      });
    }
  
    onClick() {
        this.props.addLine(this.state.currentLine)
    }

    render() {
      return (
        <div>
            <div 
                className="drawArea" 
                ref="drawArea" 
                onMouseDown={this.handleMouseDown} 
                onMouseMove={this.handleMouseMove}>
                    <Drawing line={this.state.currentLine} />
            </div>
            <button className="button" onClick={this.onClick}>Add line</button>
            <PlayerList />
        </div>
      );
    }
}

const mapDispatchToProps = (dispatch) => ({
    addLine: (line) => dispatch(addLine(line))
});

export default connect(undefined,mapDispatchToProps)(DrawArea);