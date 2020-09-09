import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Row, Input } from 'reactstrap';
import { NewSprint } from './NewItemInTable';
import { Result } from './Result';
import { NavLink } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

function enumFormatter(cell, row, enumObject) {
    return enumObject[cell];
  }

export class TaskTable extends Component {
    static displayName = TaskTable.name;

    constructor(props) {
        super(props);
        this.state = { goals: this.props.goals, tasks: [], loading: false };
    }

    componentDidMount() {
        this.populateTaskList();
    }

    renderTaskList(tasks) {
        return (
            <div>
            <div>
                <h4 id="taskLabel">All tasks</h4>
                <table className = 'table table-striped' aria-labelledby='tabelLabel'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Plan date</th>
                            <th>Goal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task =>
                            <tr key={task.myTaskId}>
                                <td>
                                    <Input id={`taskTitle_${task.myTaskId}`} placeholder="Task's title" value={task.title}
                                            onChange={() => this.editTaskTitle()} onBlur={() => this.saveTask()}
                                    />
                                </td>                                
                                <td>
                                    <Input type="date" id={`taskPlanDate_${task.myTaskId}`} placeholder="Task's plan date" value={this.mapDate(task.planDate)}
                                            onChange={() => this.editTaskPlanDate()} onBlur={() => this.saveTask()}
                                    />
                                </td>
                                <Input type="select" id={`taskGoal_${task.myTaskId}`} placeholder="Select goal" /*value={this.countGoalForTask(task.goalId)}*/
                                            onChange={() => this.editTaskGoal()} onBlur={() => this.saveTask()}>
                                            
                                            <option>{this.state.goals.filter(goal => goal.goalId === task.goalId).map(goal => goal.title)}</option>
                                            {this.state.goals.map(goal => 
                                                <option>{goal.title}</option>
                                            )}
                                    </Input>
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
                <BootstrapTable data={ tasks }>
                <TableHeaderColumn dataField='title' isKey>Title</TableHeaderColumn>
                <TableHeaderColumn dataField='planDate'>Plan date</TableHeaderColumn>
                <TableHeaderColumn dataField='goalTitle'>Goal</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }

    async countGoalTitle(goalId) {
        const token = await authService.getAccessToken();
        if (goalId !== null)
        {
            var goalUrl = `goals/get/${goalId}`;
            const goalResponse = await fetch(goalUrl, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            const goalData = await goalResponse.json();
            return goalData.title;
        }
        return "";
    }

    async deleteTask(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var taskId = targetId.split('_')[1];

        const token = await authService.getAccessToken();
        var body = taskId;
        const response = await fetch("task/delete", {
            method: 'DELETE',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
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

    async editTaskGoal(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        var targetId = target.id;
        var taskId = targetId.split('_')[1];

        var newGoal = target.value;
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

    async editTaskPlanDate(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        var targetId = target.id;
        var taskId = targetId.split('_')[1];

        var newPlanDate = target.value;
        var tasks = this.state.tasks;
        var task = tasks.filter(task => task.myTaskId === taskId)[0];
        task.planDate = newPlanDate;
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
        this.setState({tasks: tasks});
    }

    async saveTask(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var targetId = target.id;
        var taskId = targetId.split('_')[1];
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
        var tasks = this.state.tasks;
        var task = tasks.filter(task => task.myTaskId === taskId)[0];
        var oldStatus = task.completed;
        task.completed = !oldStatus;
        await this.editTask(task);
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
        var goalUrl = `goals/list`;
        const goalResponse = await fetch(goalUrl, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const goalData = await goalResponse.json();
        const extTasks = data.map(function (t) {
            t.goalTitle = goalData.filter(function(goal) {
                return goal.goalId === t.goalId;
            }).map(function(goal) {
                return goal.title;
            })[0];
        });
        this.setState({  goals: goalData, tasks: data, loading: false});
    }
}