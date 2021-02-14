﻿import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { GoalList } from './GoalList';
import { TaskList } from './TaskList';
import { ResultList } from './ResultList';
import { Collapse, Row, Col, Form, Label, Input, Button  } from 'reactstrap';
import formatter from './../helpers/Formatter';

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

    isWeekEnd() {
        let startDate = new Date(Date.parse(this.state.sprint.startDate));
        let currentDate = new Date();
        let difference = (Math.floor((currentDate - startDate)/ (1000 * 3600 * 24)) + 1) % 7;
        if (difference === 0) {
            return true;
        }
        return false;
    }

    renderSprintFields() {
        let startDate = formatter.mapDate(this.state.sprint.startDate);
        let finishDate = formatter.mapDate(this.state.sprint.endDate);
        return (
            <Form>
                <h3>{this.state.sprint.title}</h3>
                <Collapse isOpen={this.isWeekEnd()}>
                    Do not forget to add week result.
                </Collapse>
                <Row>
                    <Button color="primary" onClick={() => this.handleFinishSprint()}>Finish sprint</Button>
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
                            value={formatter.mapDate(new Date())} />
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