import React from 'react';
require('./style.less');
import { withRouter } from 'react-router-dom';

import { toast } from 'react-toastify';
import { combineLatest, BehaviorSubject } from 'rxjs';
import DatePicker from './../../components/DatePicker';

import LoadingOverlay from '../../components/LoadingOverlay';
import InfiniteScrollVirtualList from '../../components/InfiniteScrollVirtualList';
import CenteredModal from '../../components/CenteredModal';
import DedayTextInput from '../../components/DelayTextInput';


import apiService from '../../service/api.service';
import userService from '../../service/user.service';
//import dataFlowService from './isolate.service';

import DataFlow from '../../utils/dataflow-builder.util';
import Editable from '../../components/Editable';
import SearchableDropdown from '../../components/SearchableDropdown';
import PerformanceDropdown from '../../components/PerformanceDropdown';
import {findFilteredDataFn} from './../../utils/observable.util';

import option from './constant';
import TimeSelector from './TimeSelector';


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

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.timeOptions = option.timeOptions;
        this.indexOptions = option.indexOptions;

        this.cancelSearchSubmit = this.cancelSearchSubmit.bind(this);
        this.requestMoreData = this.requestMoreData.bind(this);

        this.dataFlowService = new DataFlow({ type: 0, value: [] });
        this.searchFlow = new BehaviorSubject("");
        this.userDataFlow = new DataFlow({type: 0, value: []});
        this.projectDataFlow = new DataFlow({type: 0, value: []});

        this.filteredDataFlow = combineLatest(this.dataFlowService.getDataFlow(), this.searchFlow).pipe(findFilteredDataFn);

        this.state = {
            timelast: '30m',
            index: "backend_log",
            username: "",
            project: {},
            disable: "",
            logs: [],
            searchFilter: "",
            modalActive: false,
            currentUser: null,
            role: null
        }
    }

    initLoad() {
        this.loadUserSub = apiService.getUsers().subscribe({
            next: (rs)=>{
                rs = rs.data;
                this.loadProjectList(rs.content.map((e)=>e.username));
                rs.content.unshift({username: ""});
                this.userDataFlow.putData({type: 0, value: rs.content});
            },
            error: (err)=>{
                toast.error(err.message);
            }
        });
    }

    loadProjectList(users) {
        this.loadProjectSub = apiService.getAllProjectFromUsers({users: users})
        .subscribe({
            next: (rs)=>{
                rs = rs.data;
                rs.content.unshift({idProject: -1, name: "All project"});
                //console.log(rs.content);
                this.projectDataFlow.putData({type: 0, value: rs.content});
            },
            error: (err)=>{
                toast.error(err.message);
            }
        });
    }

    componentDidMount() {
        //reset
        this.searchLogQuerySnapshot = null;
        this.searchFlow.next("");
        this.setState({
            timelast: '30d',
            username: "",
            project: "",
            disable: "",
            logs: []
        });
        this.dataFlowService.putData({ type: 0, value: [] });
        this.userDataFlow.putData({type: 0, value: []});
        this.projectDataFlow.putData({type: 0, value: []});
        //load users
        this.initLoad();
    }

    unsubscribeAll() {
        if (this.searchLogSub) {
            this.searchLogSub.unsubscribe();
            this.searchLogSub = null;
        }
        if (this.loadUserSub) {
            this.loadUserSub.unsubscribe();
            this.loadUserSub = null;
        }
        if (this.loadProjectSub) {
            this.loadProjectSub.unsubscribe();
            this.loadProjectSub = null;
        }
    }

    componentWillUnmount() {
        this.unsubscribeAll();
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
        // if (this.state.username.length == 0) {
        //     toast.error("Username can not null");
        //     return;
        // }
        this.disable();
        let match = {};
        if (this.state.username.length > 0) {
            match.username = this.state.username;
        }
        if (this.state.project.idProject >= 0) {
            match.project = this.state.project.name
        }

        //let search
        let searchQuery = {
            index: this.state.index,
            match: match,
            time: {
                from: "now-" + this.state.timelast
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
        if (!lastEl) return;
        if (this.searchLogQuerySnapshot) {
            let searchQuery = Object.assign({}, this.searchLogQuerySnapshot);
            searchQuery.time = {
                from: searchQuery.time.from,
                to: lastEl.timestamp
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
        this.searchFlow.next(value);
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
                    <div > {/*style = {display: userService.getRole() == 2 ? "none" : "block-inline", userSelect: "none"}}*/}
                        <span>Username</span>
                        <div className  = "username-choice" style = {{height: "30px", marginTop: "10px"}}>
                            <PerformanceDropdown 
                                choicesFlow = {this.userDataFlow.getDataFlow()} selected = {this.state.username} 
                                getDisplay={(value)=>value.length > 0 ? value : "All user"}
                                elHeight = {28}
                                elComponent = {(props)=><div className = "user-item">{props.elValue.username.length > 0 ? props.elValue.username : "All user"}</div>}
                                onChange = {(e)=>{this.setState({username: e.username})}}
                            />
                        </div>
                        <span>Project: </span>
                        <div className  = "project-choice" style = {{height: "30px", marginTop: "10px"}}>
                            <PerformanceDropdown 
                                choicesFlow = {this.projectDataFlow.getDataFlow()} 
                                selected = {this.state.project} 
                                getDisplay={(value)=>value.idProject >= 0 ? value.name : "All project"}
                                elHeight = {28}
                                elComponent = {(props)=><div className = "project-item">{props.elValue.idProject >= 0 ? props.elValue.name : "All project"}</div>}
                                onChange = {(e)=>{this.setState({project: e})}}
                            />
                        </div>
                    </div>
                    <div>
                        <TimeSelector />
                    </div>

                    <br/>
                    <br/>

                    <div className="submit" onClick={() => this.submitSearch()}>Submit</div>

                </div>
                <div className="main">
                    <div className={"top-bar"}>
                        <div>
                            <SearchableDropdown choices = {this.indexOptions} value = {this.state.index} onChange={(e)=>{this.setState({index: e})}}/>
                        </div>
                        <div className={"search-box"}>
                            <div style={{ marginRight: '10px', color: '#000' }} className={"ti ti-search"} />
                            <DedayTextInput placeholder="Filter" onChange = {(e)=>{this.searchFilterChanged(e);}} debounceTime = {400}/>
                            {/* <input placeholder="Filter" value={this.state.searchFilter} onChange={(e)=>{this.searchFilterChanged(e);}} /> */}
                        </div>
                        <div className={"name"}>{userService.getUsername()}</div>
                        <div className={"logout-btn"} style={{ cursor: 'pointer' }} onClick={this.logout}>Logout</div>
                        <div className={"user-picture"} />
                    </div>
                    <div className="HomePage-List">
                        <InfiniteScrollVirtualList elHeight={43} dataFlow={this.filteredDataFlow}
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
