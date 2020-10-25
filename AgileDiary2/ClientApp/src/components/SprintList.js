import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { NewItemRow } from './NewItemInTable';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';


export class SprintList extends Component {
    static displayName = SprintList.name;

    constructor(props) {
        super();
        this.state = { sprints: [], loading: true, newTitle: '', allChecked:false };
    }

    componentDidMount() {
        this.populateSprintTable();
    }

    renderSprintTable(sprints) {
        //change accordign to https://reactstrap.github.io/components/tables/
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
                                <td className="custom">{ sprint.title } </td>
                                <td className="custom">{this.mapDate(sprint.startDate) } </td>
                                <td className="custom">{this.mapDate(sprint.endDate)} </td>
                                <td className="custom"><NavLink tag={Link} to={`/sprint/${sprint.sprintId}`}><button>Edit</button></NavLink></td>
                                <td className="custom"><button id={`delete_${sprint.sprintId}`} type="button" onClick={() => this.deleteSprint()}>Delete</button></td>
                            </tr>
                        )}
                        <tr>
                        </tr>
                    </tbody> 
                </table>
                <NewItemRow value= {this.state.newTitle} onClick={() => this.handleAddSprint()} onChange={() => this.handleNewTitleChange()} />
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
        var sprintId;
        ({ sprintId, e } = this.extractSelectedItem(e));

        const token = await authService.getAccessToken();
        var body = [sprintId];
        await fetch("sprint/delete", {
            method: 'DELETE',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        await this.refreshSprintList();
        // var sprints = this.state.sprints;
        // var sprint = sprints.filter(s => s.sprintId === sprintId)[0];
        // sprints.splice(sprints.indexOf(sprint), 1);
        // this.setState({ sprints: sprints });
    }

    extractSelectedItem(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var sprintId = targetId.split('_')[1];
        return { sprintId, e };
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
        await fetch("sprint/create", {
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
        this.refreshSprintList();
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
        await this.refreshSprintList();
        this.setState({ loading: false, newTitle: '' });
    }

    async refreshSprintList() {
        const token = await authService.getAccessToken();
        const response = await fetch("sprint/list", {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json()
        this.setState({ sprints: data });
    }
}