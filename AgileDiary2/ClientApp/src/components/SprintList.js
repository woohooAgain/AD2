import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'

export class SprintList extends Component {
    static displatName = SprintList.name;

    constructor(props) {
        super(props);
        this.state = { sprints: [], loading: true };
    }

    componentDidMount() {
        this.populateSprintTable();
    }

    static renderSprintTable(sprints) {
        return (
            <table className = 'table table-striped' aria-labelledby='tabelLabel'>
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {sprints.map(sprint =>
                        <tr key={sprint.sprintId}>
                            <td>{ sprint.startDate } </td>
                            <td>{ sprint.endDate } </td>
                            <td>{ sprint.title } </td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : SprintList.renderSprintTable(this.state.sprints);
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
        this.setState({ sprints: data, loading: false });
    }
}