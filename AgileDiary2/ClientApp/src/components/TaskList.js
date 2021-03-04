import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Button, ButtonGroup, Input } from 'reactstrap';
import { ItemCreator } from './ItemCreator';
import { Collapse, NavLink, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

export class TaskList extends Component {
    static displayName = TaskList.name;

    constructor(props) {
        super(props);
        this.state = { goals: this.props.goals, tasks: [], loading: false, isOpen: true, collapseButtonName:"Collapse" };
    
        this.handleOnChange = this.handleOnChange.bind(this);        
    }

    collapse() {
        let buttonName = this.state.isOpen ? "Show" : "Collapse";
        this.setState({ isOpen: !this.state.isOpen, collapseButtonName:buttonName });
    }

    componentDidMount() {
        this.populateTaskList();
    }

    renderTaskList(tasks) {
        let itemCreatorProps = {
            value: this.state.newTitle,
            onAddClick: () => this.handleAddTask(),
            onTitleChange: () => this.handleNewTitleChange(),
            placeholder: "New task's title"
        }
        return (
            <div>
                <h4 id="taskLabel">All tasks  <Button outline  size="sm" onClick={()=>this.collapse()}>{this.state.collapseButtonName}</Button></h4>
                <Collapse isOpen={this.state.isOpen}>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Plan date</th>
                                <th>Complete date</th>
                                <th>Goal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task =>
                                <tr key={task.myTaskId}>
                                    <td>
                                        <Input value={task.title} name="title"
                                                onChange={(event) => this.handleOnChange(task.myTaskId, event)} onBlur={() => this.saveTask(task.myTaskId)}
                                        />
                                    </td>
                                    <td>
                                        <Input type="date" value={this.mapDate(task.estimatedDate)} name="estimatedDate" 
                                                onChange={(event) => this.handleOnChange(task.myTaskId, event)} onBlur={() => this.saveTask(task.myTaskId)}
                                        />
                                    </td>
                                    <td>
                                        <Input type="date" value={this.mapDate(task.completeDate)} name="completeDate" readOnly />
                                    </td>
                                    <td>
                                        <Input type="select" id={`taskGoal_${task.myTaskId}`} placeholder="Select goal" /*value={this.countGoalForTask(task.goalId)}*/
                                                onChange={(event) => this.editTaskGoal(task.myTaskId, event)} onBlur={() => this.saveTask(task.myTaskId)}>
                                                
                                                <option>{this.state.goals.filter(goal => goal.goalId === task.goalId).map(goal => goal.title)}</option>
                                                {this.state.goals.map(goal => 
                                                    <option>{goal.title}</option>
                                                )}
                                        </Input>
                                    </td>
                                    <td>
                                        <ButtonGroup>
                                            <Button close onClick={() => this.completeTask(task.myTaskId)}><span>&#10003;</span></Button>
                                        </ButtonGroup>
                                    </td>
                                    <td></td>
                                    <td><Button close onClick={() => this.deleteTask(task.myTaskId)}></Button></td>
                                </tr>
                            )}
                            <tr>
                            </tr>
                        </tbody> 
                    </Table>
                    <ItemCreator {...itemCreatorProps} />
                </Collapse>
            </div>
        )
    }

    handleOnChange(taskId, e)
    {
        var tasks = this.state.tasks;
        var task = tasks.filter(task => task.myTaskId === taskId)[0];
        task[e.target.name] = e.target.value;
        this.setState({ tasks: tasks });
    }

    async deleteTask(taskId) {
        const token = await authService.getAccessToken();
        const response = await fetch(`task/delete/${taskId}`, {
            method: 'DELETE',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        await response.json();
        var tasks = this.state.tasks;
        var task = tasks.filter(s => s.myTaskId === taskId)[0];
        tasks.splice(tasks.indexOf(task), 1);
        this.setState({ tasks: tasks });
    }

    countGoalForTask(goalId) {
        if (goalId !== null && goalId !== "") {
            return this.state.goals.filter(goal => goal.goalId === goalId)[0].title;
        }
    }

    async editTaskGoal(taskId, e) {

        var newGoal = e.target.value;
        if (newGoal == "Common task") {
            newGoal = "";
        }
        else {
            var goalId = this.state.goals.filter(goal => goal.title === newGoal)[0].goalId;
            newGoal = goalId;
        }
        var tasks = this.state.tasks;
        var task = tasks.filter(task => task.myTaskId === taskId)[0];
        task.goalId = newGoal;
        this.setState({tasks: tasks});
    }

    async saveTask(taskId) {
        var tasks = this.state.tasks;
        var task = tasks.filter(task => task.myTaskId === taskId)[0];
        await this.editTask(task);
    }

    async editTask(task) {
        const token = await authService.getAccessToken();
        const response = await fetch("task/edit", {
            method: 'PUT',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', },
            body: JSON.stringify({
                myTaskId: task.myTaskId,
                creator: task.creator,
                estimatedDate:task.estimatedDate,
                completeDate:task.completeDate,
                completed: task.completed,
                goalId: task.goalId,
                priority: task.priority,
                title: task.title
            })
        });
        await response.json();
    }

    async completeTask(taskId) {        
        var tasks = this.state.tasks;
        var task = tasks.filter(task => task.myTaskId === taskId)[0];
        var oldStatus = task.completed;
        task.completed = !oldStatus;
        task.completeDate = new Date();
        await this.editTask(task);
        this.setState({tasks: tasks});
    }
    
    counteChangeStatusNameButton(status){
        switch(status){
            case 1:
                return "&#8635;";
            default:
                return "&#10003;";
        }
    }    

    mapDate(date) {
        if (date===null){
            return null;
        }
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

    handleNewTitleChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        this.setState({ newTitle: target.value });
    }

    handleAddTask() {
        this.createTask({ title: this.state.newTitle });
        this.setState({ newTitle: '' });
    }

    async createTask(task) {
        const token = await authService.getAccessToken();
        const response = await fetch("task/create", {
            method: 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', },
            body: JSON.stringify({
                title: task.title
            })
        });
        await response.json();
        this.populateTaskList();
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : this.renderTaskList(this.state.tasks);
        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateTaskList() {
        const token = await authService.getAccessToken();
        var url = `task/listNearest`;
        const response = await fetch(url, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const goals = this.state.goals;
        data.map(function (t) {
            t.goalTitle = goals.filter(function(goal) {
                return goal.goalId === t.goalId;
            }).map(function(goal) {
                return goal.title;
            })[0];
        });       
        this.setState({  tasks: data, loading: false});        
    }
}