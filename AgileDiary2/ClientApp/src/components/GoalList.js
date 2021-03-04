import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Button, Collapse, Nav, NavItem, NavLink, Row, Col, ListGroup, TabContent, TabPane, FormGroup, Label, Input } from 'reactstrap';
import classnames from 'classnames';
import {Milestone} from './Milestone'


export class GoalList extends Component {
    static displayName = GoalList.name;

    constructor(props) {
        super(props);
        this.state = { sprintId: this.props.sprintId, goals: this.props.goals, loading: false, activeTab: this.props.goals.length > 0 ? this.props.goals[0].goalId : null, isOpen: true, collapseButtonName:"Collapse"};

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    collapse() {
        let buttonName = this.state.isOpen ? "Show" : "Collapse";
        this.setState({ isOpen: !this.state.isOpen, collapseButtonName:buttonName });
    }

    componentDidMount() {
        this.populateGoalList();
    }

    renderGoalList(goals) {
        const toggle = tab => {
            if (this.state.activeTab !== tab) {
                this.setState({activeTab: tab});
            }
        }
        return (
            <div>
                <h4 id="goalLabel">Goals in sprint  <Button outline  size="sm" onClick={()=>this.collapse()}>{this.state.collapseButtonName}</Button></h4>                                
                <Collapse isOpen={this.state.isOpen}>
                <Button outline  size="sm" color="primary" onClick={()=>this.createGoal()}>Create goal</Button>
                <Button outline  size="sm" color="danger" onClick={()=>this.deleteGoal(this.state.activeTab)}>Delete goal</Button>
                <Button outline  size="sm" color="info" onClick={()=>this.addMilestone()}>Add milestone</Button>
                    <Nav tabs>
                        {goals.map(goal =>
                            <NavItem>
                                <NavLink key={goal.goalId} onClick={() => { toggle(goal.goalId); }}
                                    className={classnames({ active: this.state.activeTab === goal.goalId})}>
                                    {goal.title}
                                </NavLink>
                            </NavItem>
                        )}
                    </Nav>  
                    <TabContent activeTab={this.state.activeTab}>
                        {goals.map(goal =>
                            <TabPane key={goal.goalId} tabId={goal.goalId} >
                                <Row>
                                    <Col sm="6">
                                        <Label for="title">Title</Label>
                                        <Input id={`title_${goal.goalId}`} placeholder="Goal's title" defaultValue={goal.title} name="title"
                                            onChange={this.handleOnChange}  onBlur={() => this.saveGoal(goal.goalId)}
                                        />
                                        <Label for="description">Description</Label>
                                        <Input id={`description_${goal.goalId}`} placeholder="Goal's description" defaultValue={goal.description} type="textarea" name="description"
                                            onChange={this.handleOnChange} onBlur={() => this.saveGoal(goal.goalId)}
                                        />
                                        <Label for="reward">Reward</Label>
                                        <Input id={`reward_${goal.goalId}`} placeholder="Goal's reward" defaultValue={goal.reward} type="textarea" name="reward"
                                            onChange={this.handleOnChange} onBlur={() => this.saveGoal(goal.goalId)}
                                        />
                                    </Col>
                                    <Col sm="6">
                                        <Label>Milestones</Label>
                                        {goal.milestones.map(m => 
                                            <Milestone milestone={m} blur={() => this.saveMilestone()} remove ={(milestone) => this.removeMilestone(milestone)} />
                                        )}
                                    </Col>
                                </Row>                            
                            </TabPane>
                        )}
                    </TabContent>
                </Collapse>
            </div>
        )
    }

    async createGoal()
    {
        const token = await authService.getAccessToken();
        let newGoal = {
            title: 'Default title',
            description: 'Default description',
            reward: 'Default reward',
            sprintId: this.state.sprintId
        };
        let createResponse = await fetch("goals/create", {
            method: 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', },
            body: JSON.stringify(newGoal)
        });
        const data = await createResponse.json();
        let goalResponse = await fetch(`/goals/get/${data}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        let createdGoal = await goalResponse.json();
        let currentGoals = this.state.goals;
        currentGoals.push(createdGoal);
        this.setState({goals:currentGoals});
    }

    async deleteGoal(goalId)
    {
        const token = await authService.getAccessToken();
        await fetch(`goals/delete/${goalId}`, {
            method: 'DELETE',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', }
        });
        let oldGoals = this.state.goals;
        let newGoals = oldGoals.filter(function(item) {
            return item.goalId !== goalId;
        })
        this.setState({goals:newGoals});
        if (this.state.goals.length > 0) {
            this.setState({activeTab:this.state.goals[0].goalId});
        }
    }

    async addMilestone()
    {
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === this.state.activeTab)[0];
        goal.milestones.push({title:"New milestone"});
        this.editGoal(goal);
    }

    saveMilestone(e)
    {
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === this.state.activeTab)[0];
        this.editGoal(goal);
    }

    removeMilestone(milestone)
    {
        var goals = this.state.goals;
        let goal = goals.filter(goal => goal.goalId === milestone.goalId)[0];
        goal.milestones = goal.milestones.filter(m => m.myTaskId !== milestone.myTaskId);
        this.setState({ goals: goals });
    }

    handleOnChange(e)
    {
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === this.state.activeTab)[0];
        goal[e.target.name] = e.target.value;
        this.setState({ goals: goals });
    }

    async saveGoal(goalId) {
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === goalId)[0];
        await this.editGoal(goal);
    }

    async editGoal(goal) {
        const token = await authService.getAccessToken();
        const response = await fetch("goals/edit", {
            method: 'PUT',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', },
            body: JSON.stringify({
                goalId: goal.goalId,
                title: goal.title,
                description: goal.description,
                reward: goal.reward,
                sprintId: goal.sprintId,
                milestones: goal.milestones
            })
        });
        await response.json();
        await this.populateGoalList();
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : this.renderGoalList(this.state.goals);
        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateGoalList() {
        const token = await authService.getAccessToken();
        var url = `goals/list/${this.state.sprintId}`;
        const response = await fetch(url, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({  goals: data, loading: false});
    }
}