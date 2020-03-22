import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { GoalList } from './GoalList';
import { TaskList } from './TaskList';
import { Row, Col, Form, Label, Input  } from 'reactstrap';


export class Sprint extends Component {
    static displayName = Sprint.name;

    constructor(props) {
        super(props);
        var sprintId = props.match.params.sprintId;
        this.state = { sprintId: sprintId, loading: true, sprint: null};
    }

    componentDidMount() {
        this.populateSprintFields();
    }

    async populateSprintFields() {
        const token = await authService.getAccessToken();
        const response = await fetch(`/sprint/get/${this.state.sprintId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const sprint = await response.json();
        this.setState({ loading: false, sprint: sprint});
    }

    async fetchGoalsForSprint() {
        const token = await authService.getAccessToken();
        const response = await fetch(`/goals/list/${this.state.sprintId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    }

    async fetchMilestonesForGoals() {
        const token = await authService.getAccessToken();
        const response = await fetch(`/milestones/list/${this.state.sprintId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
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

    renderSprintFields() {
        let startDate = this.mapDate(this.state.sprint.startDate);
        let finishDate = this.mapDate(this.state.sprint.endDate);
        return (
            <Form>
                <h3>{this.state.sprint.title}</h3>
                <button className="btn btn-outline-secondary" type="button" onClick={() => this.handleEditSprint()}>Save sprint</button>
                <Row>
                    <Col>
                        <Label for="exampleDate">Start date</Label>
                        <Input
                            type="date"
                            name="date1"
                            id="exampleDate1"
                            placeholder="date placeholder1"
                            onChange={() => this.handleOnStartChange()}
                            defaultValue={startDate} />
                    </Col>
                    <Col>
                        <Label for="exampleDate">End date</Label>
                        <Input
                            type="date"
                            name="date2"
                            id="exampleDate2"
                            placeholder="date placeholder2"
                            onChange={() => this.handleOnEndChange()}
                            defaultValue={finishDate} />
                    </Col>
                </Row>
                <Row>
                    <GoalList goals={this.state.sprint.goals} />
                </Row>
                <Row>
                    <TaskList goals={this.state.sprint.goals} />
                </Row>
            </Form>
        );
    }

    handleEditSprint() {
        this.saveSprint(this.state.sprint);
    }

    async saveSprint(sprint) {
        const token = await authService.getAccessToken();
        const response = await fetch("sprint/edit", {
            method: 'PUT',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sprintId: sprint.sprintId,
                creator: sprint.creator,
                title: sprint.title,
                startDate: sprint.startDate,
                endDate: sprint.endDate,
                goals: this.state.sprint.goals
            })
        });
        let newData = await response.json();
        this.renderSprintFields();
    }

    handleOnStartChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var newState = this.state.sprint;
        newState.startDate = target.value;
        this.setState({ sprint: newState });
    }

    handleOnEndChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var newState = this.state.sprint;
        newState.endDate = target.value;
        this.setState({ sprint: newState });
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : this.renderSprintFields();
        return (
            <div>
                {contents}
            </div>
        );
    }
}