import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'

export class NewSprint extends Component {
    render() {
        return (
            <div className="input-group mb-3" onClick={() => function () { alert('input-group mb-3'); }}>
                <input type="text" className="form-control" placeholder="New sprint's title" aria-label="New sprint's title" aria-describedby="basic-addon2"/>
                <div className="input-group-append" onClick={() => function () { alert('input-group-append'); }}>
                    <button className="btn btn-outline-secondary" type="button" onClick={() => function () { alert('btn btn-outline-secondary'); }}>Add sprint</button>
                </div>
            </div >
        )
    }
}
