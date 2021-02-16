﻿import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Button, Collapse, Nav, NavItem, NavLink, Row, Col, ListGroup, TabContent, TabPane, FormGroup, Label, Input } from 'reactstrap';
import classnames from 'classnames';
import {Milestone} from './Milestone'


export class GoalList extends Component {
    static displayName = GoalList.name;

    constructor(props) {
        super(props);
        this.state = { sprintId: this.props.sprintId, goals: this.props.goals, loading: false, activeTab: this.props.goals.length > 0 ? this.props.goals[0].goalId : null, isOpen: true, collapseButtonName:"Collapse"};
    }

    collapse() {
        let buttonName = this.state.isOpen ? "Show" : "Collapse";
        this.setState({ isOpen: !this.state.isOpen, collapseButtonName:buttonName });
    }

    renderGoalList(goals) {
        const toggle = tab => {
            if (this.state.activeTab !== tab) {
                this.setState({activeTab: tab});
            }
        }
        return (
            <div>
                <h4 id="goalLabel">Goals in sprint</h4>
                <Button outline  size="sm" onClick={()=>this.collapse()}>{this.state.collapseButtonName}</Button>
                <Button outline  size="sm" color="primary" onClick={()=>this.createGoal()}>Create goal</Button>
                <Collapse isOpen={this.state.isOpen}>
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
                                    <Col sm="7">
                                        <Label for="title">Title</Label>
                                        <Input id={`title_${goal.goalId}`} placeholder="Goal's title" defaultValue={goal.title}
                                            onChange={() => this.handleOnTitleChange()}  onBlur={() => this.saveGoal()}
                                        />
                                        <Label for="description">Description</Label>
                                        <Input id={`description_${goal.goalId}`} placeholder="Goal's description" defaultValue={goal.description} type="textarea"
                                            onChange={() => this.handleOnDescrptionChange()} onBlur={() => this.saveGoal()}
                                        />
                                        <Label for="reward">Reward</Label>
                                        <Input id={`reward_${goal.goalId}`} placeholder="Goal's reward" defaultValue={goal.reward} type="textarea"
                                            onChange={() => this.handleOnRewardChange()} onBlur={() => this.saveGoal()}
                                        />
                                    </Col>
                                    <Col sm="5">
                                        <Label>Milestones</Label>
                                        {goal.milestones.map(m => 
                                            <Milestone milestone={m}
                                            onChange={() => this.handleOnMilestoneTitleChange()} blur={() => this.saveMilestone()}
                                            />
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

    handleOnMilestoneTitleChange(e)
    {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var goalId = targetId.split('_')[0];
        var milestoneId = targetId.split('_')[1];
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === goalId)[0];
        var milestones = goal.milestones;
        var milestone = milestones.filter(milestone => milestone.milestoneId === milestoneId)[0];
        milestone.description = target.value;
        milestones[milestoneId] = milestone;
        goal.milestones = milestones;
        goals[goalId] = goal;
        this.setState({ goals: goals });
    }

    saveMilestone(e)
    {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var goalId = targetId.split('_')[0];
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === goalId)[0];
        this.editGoal(goal);
    }

    handleOnTitleChange(e)
    {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var goalId = parseInt(targetId.split('_')[1]);
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === goalId)[0];
        goal.title = target.value;
        goals[goalId] = goal;
        this.setState({ goals: goals });
    }

    handleOnDescrptionChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var goalId = parseInt(targetId.split('_')[1]);
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === goalId)[0];
        goal.description = target.value;
        goals[goalId] = goal;
        this.setState({ goals: goals });
        }

    handleOnRewardChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var goalId = parseInt(targetId.split('_')[1]);
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === goalId)[0];
        goal.reward = target.value;
        goals[goalId] = goal;
        this.setState({ goals: goals });
    }

    async saveGoal(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var goalId = parseInt(targetId.split('_')[1]);
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