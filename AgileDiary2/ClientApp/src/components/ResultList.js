import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Row, Input } from 'reactstrap';
import { NewSprint } from './NewItemInTable';
import { Result } from './Result';

export class ResultList extends Component {
    static displayName = ResultList.name;

    constructor(props) {
        super(props);
        this.state = { sprintId: this.props.sprintId, loading: true, sprintResult: null, dailyResult: null };
    }

    componentDidMount() {
        this.populateResults();
    }

    renderResults(tasks) {
        return (
            <div>
                <Row>
                    <Result result={this.state.sprintResult} title="sprint" />
                </Row>
                <Row>
                    <Result result={this.state.dailyResult} title="today"/>
                </Row>
            </div>
        )
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : this.renderResults(this.state.tasks);
        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateResults() {
        const token = await authService.getAccessToken();
        var url = `result/getForSprint/${this.state.sprintId}`;
        const response = await fetch(url, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({  sprintResult: data});
        var dateFilter = this.mapDate(Date.now());
        url = `result/getForDate/${dateFilter}`;
        const response2 = await fetch(url, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data2 = await response2.json();
        this.setState({  loading: false, dailyResult: data2});
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