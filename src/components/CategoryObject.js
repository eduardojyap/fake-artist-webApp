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
            <div className="content-container">
                <button className="category__button" onClick={this.onClick}>show/hide</button>
                    {this.state.show && (<div>{this.props.category && <h1 className="category__text">Category: {this.props.category}</h1>}
                    {this.props.name ? <h1 className="category__text">Word: {this.props.name}</h1> : <h1 className="category__text">You are the fake artist!</h1>}</div>)}
            </div>

        );
    }
}

export default CategoryObject;