import React from 'react';
import Immutable from 'immutable';
import Drawing from './Drawing';
import { startAddLine, addLine } from '../actions/drawarea';
import { connect } from 'react-redux';
import database from '../firebase/firebase';
import { Button } from 'react-bootstrap';
class DrawArea extends React.Component {
    constructor() {
      super();
  
      this.state = {
        currentLine: new Immutable.List(),
        isDrawing: false
      };
  
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleTouchStart = this.handleTouchStart.bind(this);
      this.handleTouchMove = this.handleTouchMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.onClick = this.onClick.bind(this);
    }
  
    componentDidMount() {
      document.addEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("touchend", this.handleMouseUp);
      database.ref(`sessions/${this.props.databaseCode}/lines`).on('child_added',(childSnapshot) => {
        const line = Immutable.fromJS(JSON.parse(childSnapshot.val().line))
        this.props.addLine(line,childSnapshot.val().turnId);
      })
    }
  
    componentWillUnmount() {
      document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleTouchStart(touchEvent) {
      document.body.classList.add("lock-screen");
      const point = this.relativeCoordinatesForEventTouch(touchEvent);
  
      this.setState(prevState => ({
        currentLine: prevState.currentLine.clear().push(point),
        isDrawing: true
      }));
    }
  
    handleTouchMove(touchEvent) {
      
      if (!this.state.isDrawing) {
        return;
      }
      const point = this.relativeCoordinatesForEventTouch(touchEvent);
      
      this.setState(prevState =>  ({
        currentLine: prevState.currentLine.push(point)
      }));
    }

    handleMouseDown(mouseEvent) {
      if (mouseEvent.button != 0) {
        return;
      }
      document.body.classList.add("lock-screen");
      const point = this.relativeCoordinatesForEventMouse(mouseEvent);
  
      this.setState(prevState => ({
        currentLine: prevState.currentLine.clear().push(point),
        isDrawing: true
      }));
    }
  
    handleMouseMove(mouseEvent) {
      if (!this.state.isDrawing) {
        return;
      }
      
      const point = this.relativeCoordinatesForEventMouse(mouseEvent);
      
      this.setState(prevState =>  ({
        currentLine: prevState.currentLine.push(point)
      }));
    }
  
    handleMouseUp() {
      document.body.classList.remove("lock-screen")
      this.setState({ isDrawing: false });
    }
  
    relativeCoordinatesForEventMouse(mouseEvent) {
      const boundingRect = this.refs.drawArea.getBoundingClientRect();
      return new Immutable.Map({
        x: mouseEvent.clientX - boundingRect.left,
        y: mouseEvent.clientY - boundingRect.top,
      });
    }

    relativeCoordinatesForEventTouch(touchEvent) {
      const boundingRect = this.refs.drawArea.getBoundingClientRect();
      return new Immutable.Map({
        x: (touchEvent.targetTouches[0] ? touchEvent.targetTouches[0].pageX : touchEvent.changedTouches[touchEvent.changedTouches.length-1].pageX) - boundingRect.left,
        y: (touchEvent.targetTouches[0] ? touchEvent.targetTouches[0].pageY : touchEvent.changedTouches[touchEvent.changedTouches.length-1].pageY) - boundingRect.top,
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
        <div className="drawPage__container">
        <div className="drawArea__content-container content-center">
          <div className="drawArea__container">
              <div 
                  className="drawArea"
                  ref="drawArea" 
                  onTouchStart={this.handleTouchStart} 
                  onTouchMove={this.handleTouchMove}
                  onMouseDown={this.handleMouseDown} 
                  onMouseMove={this.handleMouseMove}>
                      <Drawing line={this.state.currentLine} turn={this.props.turn} turnId={this.props.turnId}/>
              </div>
            </div>  
        </div>
        <div className="content-container content-center">
          <Button bsClass="btn btn-outline-dark btn-m button" onClick={this.onClick} disabled={!this.props.turn || this.state.currentLine.isEmpty()}>Add line</Button>
        </div>
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