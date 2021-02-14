import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Button, Collapse, Row, Input, Col } from 'reactstrap';
import { ItemCreator } from './ItemCreator';
import { Result } from './Result';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

export class ResultList extends Component {
    static displayName = ResultList.name;

    constructor(props) {
        super(props);
        this.state = { sprintId: this.props.sprintId, loading: true, isOpen: true, collapseButtonName:"Collapse"  };
    }

    collapse() {
        let buttonName = this.state.isOpen ? "Show" : "Collapse";
        this.setState({ isOpen: !this.state.isOpen, collapseButtonName:buttonName });
    }

    componentDidMount() {
        this.populateResults();
    }

    renderResults() {
        return (
            <div>
                <h4>Results</h4>
                <Button outline  size="sm" onClick={()=>this.collapse()}>{this.state.collapseButtonName}</Button>
                <Collapse isOpen={this.state.isOpen}>
                    <Row>
                        <Col md="4">
                            <Result result={this.state.sprintResult[0]} title="sprint" sprintId={this.state.sprintId} />
                        </Col>
                        <Col md="4">
                            <Result result={this.state.weekResult[0]} title="week" sprintId={this.state.sprintId} />
                        </Col>
                        <Col md="4">
                            <Result result={this.state.dailyResult[0]} title="day" sprintId={this.state.sprintId} />
                        </Col>
                    </Row>
                </Collapse>                
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
        url = `result/getForDate/${this.state.sprintId}/${dateFilter}`;
        const response2 = await fetch(url, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data2 = await response2.json();
        this.setState({  dailyResult: data2});
        url = `result/getForWeek/${this.state.sprintId}/${dateFilter}`;
        const response3 = await fetch(url, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data3 = await response3.json();
        this.setState({  loading: false, weekResult: data3});
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