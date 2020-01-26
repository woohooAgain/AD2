import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { NewSprint } from './NewItemInTable';


export class SprintList extends Component {
    static displatName = SprintList.name;

    constructor(props) {
        super(props);
        this.state = { sprints: [], loading: true, newTitle: "" };
    }

    componentDidMount() {
        this.populateSprintTable();
    }

    renderSprintTable(sprints) {
        return (
            <div>
                <table className = 'table table-striped' aria-labelledby='tabelLabel'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>End Date</th>
                            <th>Start Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sprints.map(sprint =>
                            <tr key={ sprint.sprintId }>
                                <td>{ sprint.title } </td>
                                <td>{ sprint.startDate } </td>
                                <td>{ sprint.endDate } </td> 
                            </tr>
                        )}
                        <tr>
                        </tr>
                    </tbody> 
                </table>
                <div className="input-group mb-3" >
            <input type="text" className="form-control" placeholder="New sprint's title" aria-label="New sprint's title" aria-describedby="basic-addon2" />
                <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => this.handleAddSprint()}>Add sprint</button>
    </div>
                </div>
            </div>
        )
    }

    handleNewTitleChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        console.log(target);
    }

    handleAddSprint() {
        //this.createSprint({ title: this.state.newTitle });
        console.log('ok');
        alert('ok');
    }

    async createSprint(sprint) {
        const token = await authService.getAccessToken();
        const response = await fetch("sprint/create", {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({sprint: sprint})
        });
        const id = await response.json();
        this.render();
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : this.renderSprintTable(this.state.sprints);
        return (
            <div>
                <h1 id="tabelLabel">Your sprints</h1>
                {contents}
            </div>
        );
    }

    async populateSprintTable() {
        const token = await authService.getAccessToken();
        const response = await fetch("sprint/list", {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ sprints: data, loading: false, newTitle: "" });
    }
}