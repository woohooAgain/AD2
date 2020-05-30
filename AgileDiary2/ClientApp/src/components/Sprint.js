import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { GoalList } from './GoalList';
import { TaskList } from './TaskList';
import { ResultList } from './ResultList';
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

    mapDate(date) {
        let a = new Date(Date.parse(date));
        let year = a.getFullYear();
        let month = a.getMonth() + 1;
        let day = a.getDate();

        // Creating a new Date (with the delta)
        // const finalDate = new Date(year, month, day);
        // return finalDate.toLocaleDateString().substr(0, 10);
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    }

    renderSprintFields() {
        let startDate = this.mapDate(this.state.sprint.startDate);
        let finishDate = this.mapDate(this.state.sprint.endDate);
        return (
            <Form>
                <h3>{this.state.sprint.title}</h3>
                <Row>
                    <button className="btn btn-outline-secondary" type="button" onClick={() => this.handleFinishSprint()}>Finish sprint</button>
                </Row>
                <Row>
                    <Col>
                        <Label for="exampleDate">Start date</Label>
                        <Input
                            readOnly
                            type="date"
                            name="date1"
                            id="exampleDate1"
                            placeholder="date placeholder1"
                            value={startDate} />
                    </Col>
                    <Col>
                        <Label for="exampleDate">Current date</Label>
                        <Input
                            readOnly
                            type="date"
                            name="date2"
                            id="exampleDate3"
                            placeholder="date placeholder2"
                            value={this.mapDate(new Date())} />
                    </Col>
                    <Col>
                        <Label for="exampleDate">End date</Label>
                        <Input
                            readOnly
                            type="date"
                            name="date2"
                            id="exampleDate2"
                            placeholder="date placeholder2"
                            value={finishDate} />
                    </Col>
                </Row>
                <Row>
                    <GoalList goals={this.state.sprint.goals} />
                </Row>
                <Row>
                    <TaskList goals={this.state.sprint.goals} />
                </Row>
                <Row>
                    <ResultList sprintId={this.state.sprintId} />
                </Row>
            </Form>
        );
    }

    async handleFinishSprint() {
        var newDate = new Date();
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const day = newDate.getDate();
        const finalDate = new Date(year, month, day).toISOString().substr(0, 10);
        var newState = this.state.sprint;
        newState.endDate = finalDate;
        newState.finished = true;
        await this.saveSprint(newState);
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
                goals: this.state.sprint.goals,
                finished: sprint.finished
            })
        });
        let newData = await response.json();
        this.setState({sprint: newData});
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