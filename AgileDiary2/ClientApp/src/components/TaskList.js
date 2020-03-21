import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Nav, NavItem, NavLink, Row, Col, ListGroup, TabContent, TabPane, FormGroup, Label, Input } from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { NewSprint } from './NewItemInTable';



export class TaskList extends Component {
    static displayName = TaskList.name;

    constructor(props) {
        super(props);
        this.state = { tasks: [], loading: false };
    }

    componentDidMount() {
        this.populateTaskList();
    }

    renderTaskList(tasks) {
        return (
            <div>
                <h4 id="taskLabel">Tasks in sprint</h4>
                <table className = 'table table-striped' aria-labelledby='tabelLabel'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Plan date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task =>
                            <tr key={task.myTaskId}>
                                <td>
                                    <Input id={`taskTitle_${task.myTaskId}`} placeholder="Task's title" defaultValue={task.title}
                                            onChange={() => this.editTaskTitle()}
                                    />
                                </td>
                                <td>{this.mapDate(task.planDate) } </td>                          
                                <td><button id={`delete_${task.myTaskId}`} type="button" onClick={() => this.deleteTask()}>Delete</button></td>
                        <td><button id={`changeStatus_${task.myTaskId}`} type="button" onClick={() => this.completeTask(task.myTaskId)}>{this.counteChangeStatusNameButton(task.completed)}</button></td>
                            </tr>
                        )}
                        <tr>
                        </tr>
                    </tbody> 
                </table>
                <NewSprint value= {this.state.newTitle} onClick={() => this.handleAddTask()} onChange={() => this.handleNewTitleChange()} />
            </div>
        )
    }
    
    async editTaskCompleted(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        var targetId = target.id;
        var taskId = targetId.split('_')[1];

        var completed = target.value;
        var tasks = this.state.tasks;
        var task = tasks.filter(task => task.myTaskId === taskId)[0];
        task.completed = completed;
        await this.editTask(task);
        this.setState({tasks: tasks});
    }

    async editTaskTitle(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        var targetId = target.id;
        var taskId = targetId.split('_')[1];

        var newTitle = target.value;
        var tasks = this.state.tasks;
        var task = tasks.filter(task => task.myTaskId === taskId)[0];
        task.title = newTitle;
        await this.editTask(task);
        this.setState({tasks: tasks});
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
                planDate:task.planDate,
                completed: task.completed,
                goalId: task.goalId,
                priority: task.priority,
                title: task.title
            })
        });
        await response.json();
    }

    async completeTask(taskId) {
        const token = await authService.getAccessToken();
        const response = await fetch(`task/changeState/${taskId}`, {
            method: 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', },            
        });
        await response.json();
        var tasks = this.state.tasks;
        var task = tasks.filter(task => task.myTaskId === taskId)[0];
        var oldStatus = task.completed;
        task.completed = !oldStatus;
        this.setState({tasks: tasks});
    }

    counteChangeStatusNameButton(completed){
        if (completed) {
            return "Reopen";
        }
        else {
            return "Complete";
        }
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

    handleNewTitleChange(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        this.setState({ newTitle: target.value });
    }

    handleAddTask() {
        this.createTask({ title: this.state.newTitle });
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
        var url = `task/list`;
        const response = await fetch(url, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({  tasks: data, loading: false});
    }
}