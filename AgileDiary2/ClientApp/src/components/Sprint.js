import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { NewSprint } from './NewItemInTable';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';


export class Sprint extends Component {
    static displayName = Sprint.name;

    constructor(props) {
        super(props);
        var sprintId = props.match.params.sprintId;
        this.state = { sprintId: sprintId};
    }

    render() {
        return (
            <h1>
            { this.state.sprintId } </h1>
        )
    }
}