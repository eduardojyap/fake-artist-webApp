import React from 'react';

class CategoryObject extends React.Component {
    constructor() {
        super();
        this.state = {
            show: true
        }
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        e.preventDefault();
        this.setState(prevState => ({
            show: !prevState.show
        }))
    }
    render() {
        return (
            <div>
                <button onClick={this.onClick}>show/hide</button>
                {this.state.show && (<div>{this.props.category && <h1>Category: {this.props.category}</h1>}
                {this.props.name ? <h1>Word: {this.props.name}</h1> : <h1>You are the spy!</h1>}</div>)}
            </div>

        );
    }
}

export default CategoryObject;