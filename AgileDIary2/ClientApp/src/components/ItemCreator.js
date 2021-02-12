import React, { Component } from 'react';

export class ItemCreator extends Component {
    render() {
        return (
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Title" aria-label="New sprint's title" aria-describedby="basic-addon2" onChange={() => this.props.onTitleChange()} />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => this.props.onAddClick()}>Add</button>
                </div>
            </div >
        )
    }
}
