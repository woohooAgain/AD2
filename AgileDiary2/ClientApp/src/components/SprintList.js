import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { NewSprint } from './NewItemInTable';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';


export class SprintList extends Component {
    static displayName = SprintList.name;

    constructor(props) {
        super(props);
        this.state = { sprints: [], loading: true, newTitle: '', allChecked:false };
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sprints.map(sprint =>
                            <tr key={sprint.sprintId}>
                                <td>{ sprint.title } </td>
                                <td>{this.mapDate(sprint.startDate) } </td>
                                <td>{this.mapDate(sprint.endDate)} </td>
                                <td><NavLink tag={Link} className="text-dark" to={`/sprint/${sprint.sprintId}`}>Edit</NavLink></td>
                                <td><button id={`delete_${sprint.sprintId}`} type="button" onClick={() => this.deleteSprint()}>Delete</button></td>
                            </tr>
                        )}
                        <tr>
                        </tr>
                    </tbody> 
                </table>
                <NewSprint value= {this.state.newTitle} onClick={() => this.handleAddSprint()} onChange={() => this.handleNewTitleChange()} />
            </div>
        )
    }

    mapDate(date) {
        let a = new Date(Date.parse(date));
        const year = a.getFullYear();
        const month = a.getMonth();
        const day = a.getDate();

        // Creating a new Date (with the delta)
        const finalDate = new Date(year, month, day);
        return finalDate.toISOString().substr(0, 10);
    }

    async deleteSprint(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var sprintId = targetId.split('_')[1];

        const token = await authService.getAccessToken();
        var body = [sprintId];
        const response = await fetch("sprint/delete", {
            method: 'DELETE',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        await response.json();
        var sprints = this.state.sprints;
        var sprint = sprints.filter(s => s.sprintId === sprintId)[0];
        sprints.splice(sprints.indexOf(sprint), 1);
        this.setState({ sprints: sprints });
    }

    handleNewTitleChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        this.setState({ newTitle: target.value });
    }

    handleAddSprint() {
        this.createSprint({ title: this.state.newTitle });
    }

    async createSprint(sprint) {
        const token = await authService.getAccessToken();
        const response = await fetch("sprint/create", {
            method: 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', },
            body: JSON.stringify({
                title: sprint.title,
                startDate: sprint.startDate,
                endDate: sprint.startDate
            })
        });
        await response.json();
        this.populateSprintTable();
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
        this.setState({ sprints: data, loading: false, newTitle: '' });
    }
}