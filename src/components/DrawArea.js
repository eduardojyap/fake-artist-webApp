import React from 'react';
import Immutable from 'immutable';
import Drawing from './Drawing';
import { startAddLine, addLine } from '../actions/drawarea';
import { connect } from 'react-redux';
import database from '../firebase/firebase'

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
      database.ref(`sessions/${this.props.databaseCode}/lines`).on('child_added',(childSnapshot) => {
        const line = Immutable.fromJS(JSON.parse(childSnapshot.val().line))
        this.props.addLine(line,childSnapshot.val().turnId);
      })
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
        this.props.startAddLine(this.state.currentLine,this.props.databaseCode,this.props.turnId)
        this.setState(prevState => ({
          currentLine: prevState.currentLine.clear()
        }))
    }

    render() {
      return (
        <div>
            <div 
                className="drawArea" 
                ref="drawArea" 
                onMouseDown={this.handleMouseDown} 
                onMouseMove={this.handleMouseMove}>
                    <Drawing line={this.state.currentLine} turn={this.props.turn} turnId={this.props.turnId}/>
            </div>
            <button onClick={this.onClick} disabled={!this.props.turn || this.state.currentLine.isEmpty()}>Add line</button>
        </div>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    databaseCode: state.sessions.databaseCode
  }
}

const mapDispatchToProps = (dispatch,props) => ({
    addLine: (line,turnId) => dispatch(addLine(line,turnId)),
    startAddLine: (line,databaseCode,turnId) => dispatch(startAddLine(line,databaseCode,turnId))
});

export default connect(mapStateToProps,mapDispatchToProps)(DrawArea);