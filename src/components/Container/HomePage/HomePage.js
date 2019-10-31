import React from 'react';
import { withRouter } from 'react-router-dom';

import LoadingOverlay from './../../LoadingOverlay/LoadingOverlay';
import InfiniteScrollList from './../../InfiniteScrollList/InfiniteScroll-List';
import Infinite from 'react-infinite';

import { toast } from 'react-toastify';

import apiService from './../../../service/api.service';
import dataFlowService from './isolate.service';


function MyLine(props) {
    return <div style={{height: props.height + "px"}}>{props.elValue.message}</div>
}

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.timeOptions = timeOptions;

        this.cancelSearchSubmit = this.cancelSearchSubmit.bind(this);
        this.requestMoreData = this.requestMoreData.bind(this);

        this.state = {
            timelast: '15m',
            username: "",
            projectname: "",
            disable: "",
            logs: []
        }
    }

    componentWillUnmount() {
        if (this.searchLogSub) {
            this.searchLogSub.unsubscribe();
            this.searchLogSub = null;
        }
    }

    handeChange(e) {
        let target = e.target;
        this.setState((state) => {
            state[target.name] = target.value;
            return state;
        });
    }

    disable() {
        this.setState({
            disable: "disabled"
        })
    }

    enable() {
        this.setState({
            disable: ""
        })
    }

    submitSearch() {
        if (this.state.username.length == 0) {
            toast.error("Username can not null");
            return;
        }
        this.disable();
        let match = {
            username: this.state.username
        };
        if (this.state.projectname.length > 0) {
            match.project = this.state.projectname
        }
        this.searchLogSub = apiService.searchLog({
            index: 'backend_log',
            match: match,
            time: {
                last: this.state.timelast
            },
            limit: 100
        })
            .subscribe({
                next: (rs) => {
                    rs = rs.data;
                    // this.setState({
                    //     logs: rs.content.hits.map((e) => e._source).reverse()
                    // });
                    let logs = rs.content.hits.map((e) => e._source).reverse();
                    dataFlowService.putData(logs);
                    this.enable();
                },
                error: (e) => {
                    toast.error(e.message);
                    this.enable();
                }
            });
    }

    requestMoreData(lastEl) {

    }

    cancelSearchSubmit() {
        if (this.searchLogSub) {
            this.searchLogSub.unsubscribe();
            this.searchLogSub = null;
        }
        this.enable();
    }

    render() {
        console.log(this.state.logs);
        return (
            <div>
                <span>username:</span><input name="username" onChange={(e) => this.handeChange(e)} type="text" />
                <br />
                <br />
                <span name="projectname">project:</span><input name="projectname" onChange={(e) => this.handeChange(e)} type="text" />
                <br />
                <br />
                <span>time:</span>
                <select name="timelast" value={this.state.timelast} onChange={(e) => this.handeChange(e)}>
                    {this.timeOptions.map((el, idx) => <option key={idx} value={el.value}>{el.display}</option>)}
                </select>
                <br />
                <br />
                <button onClick={() => this.submitSearch()}>Submit</button>

                <br />
                <br />

                <div style = {{height: "500px"}}>
                    <InfiniteScrollList  elHeight = {18} dataFlow = {dataFlowService.getDataFlow()}
                                onRequestMore = {this.requestMoreData}
                                elComponent = {MyLine} />
                </div>
                    
                {/* <table style={{ width: "100%" }}>
                    <tr>
                        <th>Time</th>
                        <th>Level</th>
                        <th>Project</th>
                        <th>Message</th>
                    </tr>
                    {
                        this.state.logs.map((el, idx) =>
                            (<tr key={idx}>
                                <td>{el.timestamp}</td>
                                <td>{el.level}</td>
                                <td>{el.project || "NULL"}</td>
                                <td>{el.message}</td>
                            </tr>)
                        )
                    }
                </table> */}
                <LoadingOverlay active={this.state.disable} onCancel={this.cancelSearchSubmit} />
            </div>
        );
    }
}

export default withRouter(HomePage);


let timeOptions = [
    {
        display: '1 min ago',
        value: '1m'
    },
    {
        display: '5 mins ago',
        value: '5m'
    },
    {
        display: '15 mins ago',
        value: '15m'
    },
    {
        display: '30 mins ago',
        value: '30m'
    },
    {
        display: '1 hour ago',
        value: '1h'
    },
    {
        display: '3 hours ago',
        value: '3h'
    },
    {
        display: '12 hours ago',
        value: '12h'
    },
    {
        display: '1 day ago',
        value: '1d'
    },
    {
        display: '3 days ago',
        value: '3d'
    },
    {
        display: '7 days ago',
        value: '7d'
    },
    {
        display: '15 days ago',
        value: '15d'
    },
    {
        display: '1 month ago',
        value: '30d'
    },
];