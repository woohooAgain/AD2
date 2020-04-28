import React, { Component } from 'react';

export class NewSprint extends Component {
    render() {
        return (
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Title" aria-label="New sprint's title" aria-describedby="basic-addon2" onChange={() => this.props.onChange()} />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => this.props.onClick()}>Add</button>
                </div>
            </div >
        )
    }
}
