import React, { Component } from 'react';
import { Row, Col, Form, Label, Input, FormGroup  } from 'reactstrap';


export class Milestone extends Component {
    static displayName = Milestone.name;

    constructor(props) {
        super(props);
        this.state = { milestone: this.props.milestone, saveMilestone: this.props.blur};

        this.handleOnChange = this.handleOnChange.bind(this);
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
                        <Col sm="7">
                            <Input id={`${this.state.milestone.goalId}_${this.state.milestone.milestoneId}_text`} placeholder="Default milestone" defaultValue={this.state.milestone.title} name="title"
                            onChange={this.handleOnChange} onBlur={()=>this.saveMilestone()}/>
                        </Col>
                        <Col sm="5">
                            <Input type="date" id={`${this.state.milestone.goalId}_${this.state.milestone.milestoneId}_date`} defaultValue={this.mapDate(this.state.milestone.estimatedDate)}  name="estimatedDate"
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

    handleOnChange(e)
    {
        let miletstone = this.state.milestone;
        miletstone[e.target.name] = e.target.value;
        this.setState({ miletstone: miletstone });
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