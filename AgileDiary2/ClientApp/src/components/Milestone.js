import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { GoalList } from './GoalList';
import { TaskList } from './TaskList';
import { ResultList } from './ResultList';
import { Row, Col, Form, Label, Input, FormGroup  } from 'reactstrap';


export class Milestone extends Component {
    static displayName = Milestone.name;

    constructor(props) {
        super(props);
        this.state = { milestone: this.props.milestone, saveMilestone: this.props.blur};
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
                    <Label>Milestone</Label>
                    <Row>
                        <Col>
                            <Input id={`${this.state.milestone.goalId}_${this.state.milestone.milestoneId}_text`} placeholder="Default milestone" defaultValue={this.state.milestone.description} 
                            onChange={() => this.handleOnMilestoneTitleChange()} onBlur={()=>this.saveMilestone()}/>
                        </Col>
                        <Col>
                            <Input type="date" id={`${this.state.milestone.goalId}_${this.state.milestone.milestoneId}_date`} defaultValue={this.mapDate(this.state.milestone.approximateDate)} 
                            onChange={() => this.handleOnMilestoneDateChange()} onBlur={()=>this.saveMilestone()}/>
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

    handleOnMilestoneTitleChange(e)
    {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var milestone = this.state.milestone;
        milestone.description = target.value;
        this.setState({ milestone: milestone });
    }

    handleOnMilestoneDateChange(e)
    {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var milestone = this.state.milestone;
        milestone.approximateDate = target.value;
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