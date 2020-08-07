import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'
import * as allActions from 'app/redux/Home/All/all.action'
import * as exportRecordingActions from 'app/redux/Search/ExportRecording/exportRecording.action'
import Title from "./Title"
import Table from "./Table"
import ContainerWrap from 'app/components/Container/ContainerWrap'
@connect(state => state)
export default
class ExportRecording extends React.Component {
    constructor(props) {
		super(props)
		this.state = {
			showModal:false,
		}
	}
    componentDidMount() {
        // const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
        // const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING') > -1 ? true : false) : false
        // let issuedate
        // if(intelligentStatus){
        //     issuedate = this.props.runningEnclosureState.get('issuedate')
        // }else{
        //     issuedate =this.props.fjglState.get('issuedate')
        // }
        //this.props.dispatch(exportRecordingActions.getEnclosureExportRecordingList(issuedate))
    }
    shouldComponentUpdate(nextprops, nextstate) {
        return true
        //return this.props.exportRecordingState != nextprops.exportRecordingState || this.props.allState != nextprops.allState || this.state != nextstate || this.props.homeState != nextprops.homeState
    }

    render(){
        const { dispatch, allState, homeState ,searchRunningState,runningEnclosureState,exportRecordingState} = this.props
        const dataList = exportRecordingState.get("dataList")
        const uuidList = exportRecordingState.get("uuidList")
        const selectedAll =exportRecordingState.get("selectedAll")
        const issuedate =exportRecordingState.get('issuedate')
        const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
        const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING') > -1 ? true : false) : false
        return(
            <ContainerWrap
                type="running-enclosure"
                className="runningEnclosure"
            >
                <Title
                    dispatch={dispatch}
                    issuedate={issuedate}
                    uuidList={uuidList}
                    intelligentStatus={intelligentStatus}
                    refresh={()=>{
                        dispatch(exportRecordingActions.getEnclosureExportRecordingList(issuedate))
                    }}
                />
                <Table
                    dataList={dataList}
                    dispatch={dispatch}
                    issuedate={issuedate}
                    uuidList = {uuidList}
                    selectedAll={selectedAll}
                    intelligentStatus={intelligentStatus}
                />
            </ContainerWrap>
        )

    }
}
