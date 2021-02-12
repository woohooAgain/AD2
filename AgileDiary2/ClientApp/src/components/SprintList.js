import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { ItemCreator } from './ItemCreator';
import { NavLink, Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import formatter from './../helpers/Formatter';


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
        return (
            <div>
                <Table striped>
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
                                <td className="custom">{formatter.mapDate(sprint.startDate) } </td>
                                <td className="custom">{formatter.mapDate(sprint.endDate)} </td>
                                <td className="custom"><NavLink tag={Link} to={`/sprint/${sprint.sprintId}`}><Button color="primary">Edit</Button></NavLink></td>
                                <td className="custom"><Button color="danger" id={`delete_${sprint.sprintId}`} type="button" onClick={() => this.deleteSprint()}>Delete</Button ></td>
                            </tr>
                        )}
                    </tbody> 
                </Table>
                <ItemCreator value = {this.state.newTitle} onAddClick={() => this.handleAddSprint()} onTitleChange={() => this.handleNewTitleChange()} />
            </div>
        )
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
        this.state.newTitle = "";
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