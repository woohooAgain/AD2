import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Button, Input } from 'reactstrap';
import { ItemCreator } from './ItemCreator';
import { Collapse, NavLink, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

export class TaskList extends Component {
    static displayName = TaskList.name;

    constructor(props) {
        super(props);
        this.state = { goals: this.props.goals, tasks: [], loading: false, isOpen: true, collapseButtonName:"Collapse" };
    }

    collapse() {
        let buttonName = this.state.isOpen ? "Show" : "Collapse";
        this.setState({ isOpen: !this.state.isOpen, collapseButtonName:buttonName });
    }

    componentDidMount() {
        this.populateTaskList();
    }

    async afterSaveCell (row, cellName, cellValue) {
        const token = await authService.getAccessToken();
        var newGoal = row.goalTitle;
        if (newGoal == "Common task") {
            goalId = "";
        }
        else {
            var goalId = this.state.goals.filter(goal => goal.title === newGoal)[0].goalId;
        }
        const response = await fetch("task/edit", {
            method: 'PUT',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', },
            body: JSON.stringify({
                myTaskId: row.myTaskId,
                creator: row.creator,
                planDate:row.planDate,
                completed: row.completed,
                goalId: goalId,
                priority: row.priority,
                title: row.title
            })
        });
        await response.json();
    }

    renderTaskList(tasks) {
        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: this.afterSaveCell.bind(this)
        };
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
                                        <Input id={`taskTitle_${task.myTaskId}`} placeholder="Task's title" value={task.title}
                                                onChange={() => this.editTaskTitle()} onBlur={() => this.saveTask()}
                                        />
                                    </td>
                                    <td>
                                        <Input type="date" id={`taskPlanDate_${task.myTaskId}`} placeholder="Task's plan date" value={this.mapDate(task.estimatedDate)}
                                                onChange={() => this.editTaskPlanDate()} onBlur={() => this.saveTask()}
                                        />
                                    </td>
                                    <td>
                                        <Input type="date" id={`taskCompleteDate_${task.myTaskId}`} placeholder="Task's complete date" value={this.mapDate(task.completeDate)}
                                                readOnly
                                        />
                                    </td>
                                    <td>
                                        <Input type="select" id={`taskGoal_${task.myTaskId}`} placeholder="Select goal" /*value={this.countGoalForTask(task.goalId)}*/
                                                onChange={() => this.editTaskGoal()} onBlur={() => this.saveTask()}>
                                                
                                                <option>{this.state.goals.filter(goal => goal.goalId === task.goalId).map(goal => goal.title)}</option>
                                                {this.state.goals.map(goal => 
                                                    <option>{goal.title}</option>
                                                )}
                                        </Input>
                                    </td>
                            
                                    
                                    <td><Button close onClick={() => this.completeTask(task.myTaskId)}><span>&#10003;</span></Button></td>
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
        task.completeDate = new Date();
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