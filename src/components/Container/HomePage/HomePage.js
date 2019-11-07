import React from 'react';
import { withRouter } from 'react-router-dom';

import LoadingOverlay from '../../LoadingOverlay';
import InfiniteScrollList from '../../InfiniteScrollList';
import CenteredModal from '../../CenteredModal';
import DedayTextInput from './../../DelayTextInput';

import { toast } from 'react-toastify';

import {combineLatest, Observable} from 'rxjs';

import apiService from './../../../service/api.service';
import userService from './../../../service/user.service';
//import dataFlowService from './isolate.service';

import DataFlow from './../../../service/dataflow-builder.service';
import searchFlow from './isolate.service';

require('./style.less');
function MyLine(props) {
    return (
        <div className={(props.index % 2) ? "MyLine odd" : "MyLine even"}>
            {/* <span className="status-column">
                <div className={(props.elValue.level === 'error') ? "alert" : "infor"}></div>
            </span> */}
            <span className="first-column">
                <div className={(props.elValue.level === 'error') ? "alert" : "infor"}></div>
                {props.elValue.level}</span>
            <span className="second-column">{props.elValue.project}</span>
            <span className="third-column">{props.elValue.message}</span>
        </div>
    );
}
var findFilterDataFn = (observable) => new Observable(observer => {
    // this function will called each time this
    // Observable is subscribed to.
    const subscription = observable.subscribe({
      next: function(value) {
          observer.next({
              type: value[0].type,
              value: value[0].value.filter((e)=> JSON.stringify(e).includes(value[1].toLowerCase()))
          });
      },
      error: function(err) {
        observer.error(err);
      },
      complete: function() {
        observer.complete();
      }
    });
    // the return value is the teardown function,
    // which will be invoked when the new
    // Observable is unsubscribed from.
    return () => {
      subscription.unsubscribe();
    }
});
function findFilterData() {
    return (observable) => new Observable(observer => {
      // this function will called each time this
      // Observable is subscribed to.
      const subscription = observable.subscribe({
        next: function(value) {
            observer.next({
                type: value[0].type,
                value: value[0].value.filter((e)=> JSON.stringify(e).includes(value[1].toLowerCase()))
            });
        },
        error: function(err) {
          observer.error(err);
        },
        complete: function() {
          observer.complete();
        }
      });
      // the return value is the teardown function,
      // which will be invoked when the new
      // Observable is unsubscribed from.
      return () => {
        subscription.unsubscribe();
      }
    });
  }

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.timeOptions = timeOptions;
        this.indexOptions = indexOptions;

        this.cancelSearchSubmit = this.cancelSearchSubmit.bind(this);
        this.requestMoreData = this.requestMoreData.bind(this);

        this.dataFlowService = new DataFlow({ type: 0, value: [] });

        this.filteredDataFlow = combineLatest(this.dataFlowService.getDataFlow(), searchFlow.getDataFlow()).pipe(findFilterDataFn);
        
        this.state = {
            timelast: '30m',
            index: "backend_log",
            username: "",
            projectname: "",
            disable: "",
            logs: [],
            searchFilter: "",
            modalActive: false
        }
    }

    componentDidMount() {
        this.searchLogQuerySnapshot = null;
        //reset
        this.setState({
            timelast: '30d',
            username: "",
            projectname: "",
            disable: "",
            logs: []
        });
        this.dataFlowService.putData({ type: 0, value: [] });
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

        //let search
        let searchQuery = {
            index: this.state.index,
            match: match,
            time: {
                last: this.state.timelast
            },
            limit: 100
        }


        this.searchLogSub = apiService.searchLog(searchQuery)
            .subscribe({
                next: (rs) => {
                    rs = rs.data;
                    // this.setState({
                    //     logs: rs.content.hits.map((e) => e._source).reverse()
                    // });
                    let logs = rs.content.hits.map((e) => e._source);
                    this.dataFlowService.putData({ type: 0, value: logs });
                    //console.log('data:', dataFlowService.getDataValue());
                    this.searchLogQuerySnapshot = searchQuery;
                    this.enable();
                },
                error: (e) => {
                    toast.error(e.message);
                    this.enable();
                }
            });
    }

    requestMoreData(lastEl) {
        if (this.searchLogQuerySnapshot) {
            let searchQuery = Object.assign({}, this.searchLogQuerySnapshot);
            searchQuery.time = {
                gte: "now-" + this.searchLogQuerySnapshot.time.last,
                lt: lastEl.timestamp
            }
            this.disable();
            this.searchLogSub = apiService.searchLog(searchQuery)
                .subscribe({
                    next: (rs) => {
                        rs = rs.data;
                        let logs = rs.content.hits.map((e) => e._source);
                        this.dataFlowService.putData({ type: 1, value: this.dataFlowService.getDataValue().value.concat(logs) });
                        //dataFlowService.putData(newLogs);
                        this.enable();
                    },
                    error: (e) => {
                        toast.error(e.message);
                        this.enable();
                    }
                });
        }
    }

    cancelSearchSubmit() {
        if (this.searchLogSub) {
            this.searchLogSub.unsubscribe();
            this.searchLogSub = null;
        }
        this.enable();
    }

    logout() {
        userService.setToken(null);
    }

    searchFilterChanged(e) {
        let value = e;
        this.setState({
            searchFilter: value
        });
        searchFlow.putData(value);
    }

    displayDetail(e) {
        this.setState({
            modalActive: true,
            modalValue: e
        });
    }

    onCancel() {
        this.setState({
            modalActive: false,
            modalValue: {}
        })
    }

    render() {
        return (
            <div className="HomePage">
                <div className="setting">
                    <span>
                        Log view
                    </span>
                    <div>
                        <span>Username</span>
                        <input name="username" onChange={(e) => this.handeChange(e)} type="text" />
                    </div>
                    <div>
                        <span name="projectname">Project Id</span>
                        <input name="projectname" onChange={(e) => this.handeChange(e)} type="text" />
                    </div>

                    {/* <div>
                        <span>Time</span>
                        <select name="timelast" value={this.state.timelast} onChange={(e) => this.handeChange(e)}>
                            {this.timeOptions.map((el, idx) => <option key={idx} value={el.value}>{el.display}</option>)}
                        </select>
                    </div> */}

                    <div className="submit" onClick={() => this.submitSearch()}>Submit</div>

                </div>
                <div className="main">
                    <div className={"top-bar"}>
                        <div>
                            <select name="index" value={this.state.index} onChange={(e) => this.handeChange(e)}>
                                {this.indexOptions.map((el, idx) => <option key={idx} value={el.value}>{el.display}</option>)}
                            </select>
                        </div>
                        <div className={"search-box"}>
                            <div style={{ marginRight: '10px', color: '#000' }} className={"ti ti-search"} />
                            <DedayTextInput placeholder="Filter" onChange = {(e)=>{this.searchFilterChanged(e);}} debounceTime = {400}/>
                            {/* <input placeholder="Filter" value={this.state.searchFilter} onChange={(e)=>{this.searchFilterChanged(e);}} /> */}
                        </div>
                        <div className={"name"}>Hoang</div>
                        <div className={"logout-btn"} style={{ cursor: 'pointer' }} onClick={this.logout}>Logout</div>
                        <div className={"user-picture"} />
                    </div>
                    <div className="HomePage-List">
                        <InfiniteScrollList elHeight={43} dataFlow={this.filteredDataFlow}
                            onRequestMore={this.requestMoreData}
                            elComponent={MyLine} onElementClick = {(el)=>{this.displayDetail(el)}}/>
                    </div>
                </div>

                <LoadingOverlay active={this.state.disable} onCancel={this.cancelSearchSubmit} />
                <CenteredModal onCancel = {()=>{this.onCancel()}} active = {this.state.modalActive}>
                    <div style={{backgroundColor: "white", padding: "10px", border: "solid 1px blue"}}>
                        <pre>
                            <code>
                                {
                                    JSON.stringify(this.state.modalValue, null, 4)
                                }
                            </code>
                        </pre>
                    </div>
                </CenteredModal>
            </div>
        );
    }
}

export default withRouter(HomePage);

let indexOptions = [
    {
        display: "BACKEND SERVICE",
        value: "backend_log"
    }
]


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