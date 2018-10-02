import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Register } from './Register.js';
import { Login } from './Login.js';

export class Main extends React.Component {

    getRoot = () => {
        return <Redirect to="/login" />;
    }
    render() {
        return (
            <div className="main">
                <Switch>
                    <Route exact path="/" component={this.getRoot}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route render={this.getRoot}/>
                </Switch>

            </div>
        );
    }
}