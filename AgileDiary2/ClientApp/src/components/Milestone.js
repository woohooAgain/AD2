import React, { Component } from 'react';
import { Button, Row, Col, Form, Label, Input, FormGroup  } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'

export class Milestone extends Component {
    static displayName = Milestone.name;

    constructor(props) {
        super(props);
        this.state = { milestone: this.props.milestone, saveMilestone: this.props.blur, removeMilestone: this.props.remove};

        this.handleOnChange = this.handleOnChange.bind(this);
        this.removeMilestone = this.removeMilestone.bind(this);
    }

    componentDidMount() {
        //this.populateMilestoneFields();
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
        return (
            <div>
                <FormGroup>                                    
                    <Row>
                        <Col sm="6">
                            <Input id={`${this.state.milestone.goalId}_${this.state.milestone.myTaskId}_text`} placeholder="Default milestone" defaultValue={this.state.milestone.title} name="title"
                            onChange={this.handleOnChange} onBlur={()=>this.saveMilestone()}/>
                        </Col>
                        <Col sm="1">
                            <Button close onClick={() => this.removeMilestone(this.state.milestone.myTaskId)}></Button>
                        </Col>
                        <Col sm="5">
                            <Input type="date" id={`${this.state.milestone.goalId}_${this.state.milestone.myTaskId}_date`} defaultValue={this.mapDate(this.state.milestone.estimatedDate)}  name="estimatedDate"
                            onChange={this.handleOnChange} onBlur={()=>this.saveMilestone()}/>
                        </Col>                    
                    </Row>
                </FormGroup>
            </div>
        );
    }

    saveMilestone(e)
    {
        e = e || window.event;
        this.state.saveMilestone(e);
    }

    async removeMilestone() {
        let milestone = this.state.milestone;
        const token = await authService.getAccessToken();
        await fetch(`task/delete/${milestone.myTaskId}`, {
            method: 'DELETE',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', }
        });
        this.state.removeMilestone(milestone);
    }

    handleOnChange(e)
    {
        let milestone = this.state.milestone;
        milestone[e.target.name] = e.target.value;
        this.setState({ milestone: milestone });
    }

    render() {
        let contents = this.renderSprintFields();
        return (
            <div>
                {contents}
            </div>
        );
    }
}