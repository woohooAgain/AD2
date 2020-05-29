import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { SprintList } from './components/SprintList';
import { ResultTable } from './components/ResultTable';
import { TaskTable } from './components/TaskTable';
import { Sprint } from './components/Sprint';
import { Counter } from './components/Counter';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <AuthorizeRoute path='/fetch-data' component={FetchData} />
        <AuthorizeRoute path='/sprintList' component={SprintList} />
        <AuthorizeRoute path='/sprint/:sprintId' component={Sprint} />
        <AuthorizeRoute path='/result/:sprintId/:resultOrigin' component={ResultTable} />
        <AuthorizeRoute path='/task/list' component={TaskTable} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}
