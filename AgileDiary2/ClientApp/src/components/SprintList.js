import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { NewSprint } from './NewItemInTable';


export class SprintList extends Component {
    static displayName = SprintList.name;

    constructor(props) {
        super(props);
        this.state = { sprints: [], loading: true, newTitle: '' };
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
                <NewSprint value= {this.state.newTitle} onClick={() => this.handleAddSprint()} onChange={() => this.handleNewTitleChange()} />
            </div>
        )
    }

    handleNewTitleChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        this.setState({ sprints: this.state.sprints, loading: this.state.loading, newTitle:target.value })
        //this.state.newTitle = target.value;
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