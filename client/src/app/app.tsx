import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from 'react-router-dom';
import { Menu } from 'antd';
import { MenuOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';

import NotFound from './views/NotFound';
import Home from './views/Home';
import Stats from './views/Stats';

class App extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/stats' component={Stats} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default withRouter(App);
