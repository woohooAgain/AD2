import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { Row, Input } from 'reactstrap';
import { NewSprint } from './ItemCreator';
import { Result } from './Result';
import { NavLink } from 'reactstrap';

export class ResultTable extends Component {
    static displayName = ResultTable.name;

    constructor(props) {
        super(props);
        var sprintId = props.match.params.sprintId;
        var origin = props.match.params.resultOrigin;
        this.state = { sprintId: sprintId, resultOrigin: origin, loading: true };
    }

    componentDidMount() {
        this.populateResults();
    }

    renderResultTable(results) {
        return (
            <div>
                <table className = 'table table-striped' aria-labelledby='tabelLabel'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Thanks</th>
                            <th>Achievement</th>
                            <th>Lesson</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result =>
                            <tr key={result.resultId}>
                                <td>{ this.mapDate(result.date) } </td>
                                <td>{ result.thanks } </td>
                                <td>{ result.achievement } </td>
                                <td>{ result.lesson } </td>
                            </tr>
                        )}
                    </tbody> 
                </table>
            </div>
        )
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : this.renderResultTable(this.state.results);
        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateResults() {
        const token = await authService.getAccessToken();
        var url = `result/${this.state.sprintId}/${this.state.resultOrigin}`;
        const response = await fetch(url, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({  results: data, loading: false});
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
}