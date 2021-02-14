import React, { Component } from 'react';

export class ItemCreator extends Component {
    render() {
        return (
            <div className="input-group mb-3">
                <input value = {this.props.value} type="text" className="form-control" placeholder={this.props.placeholder} onChange={() => this.props.onTitleChange()} />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => this.props.onAddClick()}>Add</button>
                </div>
            </div >
        )
    }
}
