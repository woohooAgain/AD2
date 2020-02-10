﻿import React, { Component, useState } from 'react';
import authService from './api-authorization/AuthorizeService'
import { NewSprint } from './NewItemInTable';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, Row, Col, ListGroup, ListGroupItem, TabContent, TabPane } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, FormText,  InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import classnames from 'classnames';


export class GoalList extends Component {
    static displayName = GoalList.name;

    constructor(props) {
        super(props);
        this.state = { goals: this.props.goals, loading: false, activeTab: this.props.goals[0].goalId};
    }

    renderGoalList(goals) {
        const toggle = tab => {
            if (this.state.activeTab !== tab) {
                this.setState({activeTab: tab});
            }
        }
        return (
            <div>
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
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input id={`title_${goal.goalId}`} placeholder="Goal's title" defaultValue={goal.title}
                                    onChange={() => this.handleOnTitleChange()}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input id="description" placeholder="Goal's description" defaultValue={goal.description}
                                    onChange={() => this.handleOnDescrptionChange()}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="reward">Reward</Label>
                                <Input id="reward" placeholder="Goal's reward" defaultValue={goal.reward}
                                    onChange={() => this.handleOnRewardChange()}
                                />
                            </FormGroup>
                        </TabPane>
                    )}
                    </TabContent>
                </div>
        )
    }

    handleOnTitleChange(e)
    {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var goalId = targetId.split('_')[1];
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
        var goalId = targetId.split('_')[1];
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === goalId)[0];
        goal.title = target.value;
        goals[goalId] = goal;
        this.setState({ goals: goals });
        }

    handleOnRewardChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var goalId = targetId.split('_')[1];
        var goals = this.state.goals;
        var goal = goals.filter(goal => goal.goalId === goalId)[0];
        goal.title = target.value;
        goals[goalId] = goal;
        this.setState({ goals: goals });
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : this.renderGoalList(this.state.goals);
        return (
            <div>
                <h4 id="goalLabel">Goals in sprint</h4>
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