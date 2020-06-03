import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Input, FormGroup, Label, Collapse } from 'reactstrap';
import { Collsapse, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

export class Result extends Component {
    static displayName = Result.name;

    constructor(props) {
        super(props);
        this.state = { result: this.props.result, title:this.props.title, sprintId:this.props.sprintId, isOpen: true, collapseButtonName:"Collapse" };
    }

    collapse() {
        let buttonName = this.state.isOpen ? "Show" : "Collapse";
        this.setState({ isOpen: !this.state.isOpen, collapseButtonName:buttonName });
    }

    renderResults() {
        return (
            <div>
                <h4 id={`result${this.state.title}`}>Result for {this.state.title}</h4>
                <button className="btn btn-outline-secondary" type="button" onClick={()=>this.collapse()}>{this.state.collapseButtonName}</button>
                <Collapse isOpen={this.state.isOpen}>
                    <NavLink tag={Link} className="text-dark" to={`/result/${this.state.sprintId}/${this.state.title}`}>Inspect all</NavLink>
                    <FormGroup>
                        <Label for="thanks">Thanks</Label>
                        <Input id={`thanks_${this.state.result.resultId}`} placeholder="Thanks" value={this.state.result.thanks}
                            onChange={() => this.editResultThanks()} onBlur={() => this.saveResult()}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="achievement">Achievement</Label>
                        <Input id={`chievement_${this.state.result.resultId}`} placeholder="Achievement" value={this.state.result.achievement}
                            onChange={() => this.editResultAchievement()} onBlur={() => this.saveResult()}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lesson">Lesson</Label>
                        <Input id={`lesson_${this.state.result.resultId}`} placeholder="Lesson" value={this.state.result.lesson}
                            onChange={() => this.editResultLesson()} onBlur={() => this.saveResult()}
                        />
                    </FormGroup>
                </Collapse>                
            </div>
        )
    }

    async editResultThanks(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        var targetId = target.id;
        var taskId = targetId.split('_')[1];

        var newThanks = target.value;
        var result = this.state.result;
        result.thanks = newThanks;
        
        this.setState({result: result});
    }

    async saveResult(e) {
        await this.editResult(this.state.result);
    }

    async editResultAchievement(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        var targetId = target.id;
        var taskId = targetId.split('_')[1];

        var newAchievement = target.value;
        var result = this.state.result;
        result.achievement = newAchievement;
        this.setState({result: result});
    }

    async editResultLesson(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        var targetId = target.id;
        var taskId = targetId.split('_')[1];

        var newLesson = target.value;
        var result = this.state.result;
        result.lesson = newLesson;
        this.setState({result: result});
    }

    async editResult(result) {
        const token = await authService.getAccessToken();
        const response = await fetch("result/edit", {
            method: 'PUT',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`, 'Accept': 'application/json',
                'Content-Type': 'application/json', },
            body: JSON.stringify({
                resultId: this.state.result.resultId,
                thanks: this.state.result.thanks,
                achievement: this.state.result.achievement,
                lesson: this.state.result.lesson
            })
        });
        await response.json();
    }

    render() {
        return (
            <div>
                {this.renderResults()}
            </div>
        );
    }

    mapDate(date) {
        let a = new Date(date);
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
}