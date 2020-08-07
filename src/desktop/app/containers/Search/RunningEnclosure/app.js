import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import EnclosurePreview from 'app/containers/components/EnclosurePreview'
import Title from "./Title"
import Table from "./Table"
import RadioItem from"./RadioItem"
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as runningEnclosureActions from 'app/redux/Search/RunningEnclosure/runningEnclosure.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'
import * as exportRecordingActions from 'app/redux/Search/ExportRecording/exportRecording.action'
import { Modal,Button ,Radio,Icon,Input} from 'antd'
@connect(state => state)
export default
class RunningEnclosure extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showModal:false,
			showTagModal:false,
			tagValue:"",
			editTag:"",
			selfTagValue:"",

		}
	}
    componentDidMount() {
		// const issuedate = this.props.searchRunningState.getIn(['flags', 'issuedate'])
		// const endissuedate = this.props.searchRunningState.getIn(['flags', 'endissuedate'])
		// const chooseValue = this.props.searchRunningState.getIn(['flags', 'chooseValue'])
        // this.props.dispatch(runningEnclosureActions.getRunningEnclosureData(issuedate,endissuedate))
		// this.props.dispatch(runningEnclosureActions.handleRunningEnclosureChooseStatus(chooseValue))
	}
	componentWillReceiveProps(props){
		const previousPage = sessionStorage.getItem('previousPage')
		if((props.searchRunningState.getIn(['flags', 'issuedate'])!==this.props.runningEnclosureState.get('issuedate') ||props.searchRunningState.getIn(['flags', 'endissuedate'])!==this.props.runningEnclosureState.get('endissuedate')||props.searchRunningState.getIn(['flags', 'chooseValue'])!==this.props.runningEnclosureState.get('chooseValue'))&&previousPage){
			sessionStorage.setItem('previousPage', '')
			// const issuedate = props.searchRunningState.getIn(['flags', 'issuedate'])
			// const endissuedate = props.searchRunningState.getIn(['flags', 'endissuedate'])
			// const chooseValue = props.searchRunningState.getIn(['flags', 'chooseValue'])
			// this.props.dispatch(runningEnclosureActions.getRunningEnclosureData(issuedate,endissuedate))
			// this.props.dispatch(runningEnclosureActions.handleRunningEnclosureChooseStatus(chooseValue))
		}

	}
	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.runningEnclosureState != nextprops.runningEnclosureState || this.props.allState != nextprops.allState || this.state != nextstate || this.props.homeState != nextprops.homeState
	}
    render(){
		const { dispatch, allState, homeState ,searchRunningState,runningEnclosureState} = this.props
		const issues = searchRunningState.get('issues')
        const issuedate = runningEnclosureState.get('issuedate')
		const endissuedate = runningEnclosureState.get('endissuedate')
		const chooseValue = runningEnclosureState.get('chooseValue')
		const totalSize = runningEnclosureState.get('totalSize')
		const useSizeByCorp = runningEnclosureState.get('useSizeByCorp')
		const useSizeBySob = runningEnclosureState.get('useSizeBySob')
		const dataList = runningEnclosureState.get('jsonArray')
		const previewSrcIdx = runningEnclosureState.get('previewSrcIdx')
		const preview = runningEnclosureState.getIn(['flags', 'preview'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const previewImgArr = runningEnclosureState.get('previewImgArr')
		const selectList =  runningEnclosureState.get('selectList')
		const selectedAll = runningEnclosureState.get('selectedAll')
		const searchCondition = runningEnclosureState.get('searchCondition')
		const searchContent = runningEnclosureState.get('searchContent')
		const tagList = runningEnclosureState.get('tagList')
		const enclosureKey = runningEnclosureState.get("enclosureKey")
		const labelValue = runningEnclosureState.get("labelValue")
		const tagId = runningEnclosureState.get("tagId")
        const searchRunningPreviewVisibility = allState.getIn(['views', 'searchRunningPreviewVisibility'])

        return(
			<ContainerWrap
				type="running-enclosure"
				className="runningEnclosure"
				onClick={() => {
					if (searchRunningPreviewVisibility) {
						dispatch(previewRunningActions.closePreviewRunning())
						dispatch(runningEnclosureActions.getRunningEnclosureData(issuedate,endissuedate))
						dispatch(runningEnclosureActions.handleRunningEnclosureChooseStatus(chooseValue))
					}
				}}
			>
				<Title
					issues={issues}
					issuedate={issuedate}
					endissuedate={endissuedate}
					chooseValue={chooseValue}
					dispatch={dispatch}
					totalSize={totalSize}
					useSizeByCorp={useSizeByCorp}
					useSizeBySob={useSizeBySob}
					selectList={selectList}
					dataList={dataList}
					searchCondition={searchCondition}
					searchContent={searchContent}
					refresh={()=>{
						dispatch(runningEnclosureActions.getRunningEnclosureData(issuedate,endissuedate))
						dispatch(runningEnclosureActions.handleRunningEnclosureChooseStatus(chooseValue))
					}}
					showModal={()=>{
						this.setState({
							showModal:true
						})
					}}
				/>
				<Table
					dataList={dataList}
					dispatch={dispatch}
					selectList={selectList}
					selectedAll={selectedAll}
					issuedate={issuedate}
					endissuedate={endissuedate}
					searchCondition={searchCondition}
					searchContent={searchContent}
					showTagListModal={()=>{
						this.setState({showTagModal:true})
					}}
					refresh={()=>{
						dispatch(runningEnclosureActions.getRunningEnclosureData(issuedate,endissuedate))
						dispatch(runningEnclosureActions.handleRunningEnclosureChooseStatus(chooseValue))
					}}
				/>
				<EnclosurePreview
					page={previewSrcIdx}
					dispatch={dispatch}
					preview={preview}
					downloadPermission={PzPermissionInfo.getIn(['arrange', 'permission'])}
					downloadEnclosure={(enclosureUrl, fileName) => dispatch(allDownloadEnclosure(enclosureUrl, fileName))}
					previewImgArr={previewImgArr}
					closePreviewModal={() => dispatch(runningEnclosureActions.closeRunningEncloseurePreviewModal())}

				/>
				<Modal
					visible={this.state.showModal}
					title="导出处理中"
					closable={false}
					// onCancel={()=>{
					// 	this.setState({showModal:false})
					// }}
					footer={[
						// <Button type="ghost" onClick={()=>{
						// 	this.setState({showModal:false})
						// }}>好的</Button>,
						<Button type="ghost" onClick={()=>{
							dispatch(exportRecordingActions.getEnclosureExportRecordingList(issuedate))
							dispatch(homeActions.addPageTabPane('SearchPanes', 'ExportRecording', 'ExportRecording', '导出记录'))
							dispatch(homeActions.addHomeTabpane('Search', 'ExportRecording', '导出记录'))
							this.setState({showModal:false})
						}}>前往下载</Button>
					]}
				>
					<p>导出处理中，稍后请进入“导出记录”页面下载。如遇导出文件较大，处理耗时将相应延长，请耐心等待。</p>
				</Modal>
				<Modal
					visible={this.state.showTagModal}
					title="修改标签"
					onCancel={()=>{
						this.setState({showTagModal:false,selfTagValue:'',tagValue:'',})
					}}
					footer={[
						<Button type="ghost" onClick={()=>{
							this.setState({showTagModal:false,selfTagValue:'',tagValue:'',})
						}}>取消</Button>,
						<Button type="ghost" onClick={()=>{
							if(this.state.tagValue!==""){
								if(this.state.tagValue==="self"){
									dispatch(runningEnclosureActions.insertEnclosureLabel(this.state.selfTagValue,enclosureKey,issuedate,endissuedate,searchCondition,searchContent))
								}else{
									if(tagId===this.state.editTag){
										dispatch(runningEnclosureActions.modifyEnclosureLabel(tagId,labelValue,enclosureKey,issuedate,endissuedate,searchCondition,searchContent))
									}else{
										dispatch(runningEnclosureActions.upLoadRunningEnclosureLabel({label:labelValue,enKey:enclosureKey},issuedate,endissuedate,searchCondition,searchContent))
									}
								}
							}
							this.setState({
								tagValue:'',
								showTagModal:false,
								selfTagValue:''
							})
						}}>确定</Button>
					]}
				>
					<Radio.Group
						value={this.state.tagValue}
						style={{width:"100%",display:"flex",flexWrap:'wrap'}}
						onChange={(e)=>{
							this.setState({
								tagValue:e.target.value,
								editTag:"",
							})
						}}
					>
						{tagList.map((e,i)=>{
							return(
								<RadioItem
									key={i}
									id={e.id}
									label={e.label}
									check={e.id === this.state.tagValue}
									edit={this.state.editTag === e.id}
									setEditTag={(id)=>{
										this.setState({editTag:id})
									}}
									clearTagValue={()=>{
										this.setState({tagValue:''})
									}}
									clearSelfTagValue={()=>{
										this.setState({selfTagValue:''})
									}}
									dispatch={dispatch}
								/>
							)
						})}
						<div style={{width:"100%",height:"40px",lineHeight:"40px"}}>
							<Radio value="self">
								<span style={{width:"160px",display:"inline-block"}}>
								自定义
								{this.state.tagValue==="self"&&
									<Input
										style={{marginLeft:"10px"}}
										value={this.state.selfTagValue}
										onChange={(e)=>{
											this.setState({selfTagValue:e.target.value})
										}}/>}
								</span>
							</Radio>
						</div>
					</Radio.Group>
				</Modal>
			</ContainerWrap>)
    }
}
