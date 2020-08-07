import React from 'react'
import {immutableRenderDecorator} from 'react-immutable-render-mixin'
import {TableOver,CxpzTableItem} from 'app/components'
import {Progress,Button} from 'antd'
import fetchApi from 'app/constants/fetch.constant.js'
import {showMessage} from 'app/utils'
import {  Checkbox ,notification} from 'antd'
import * as exportRecordingActions from 'app/redux/Search/ExportRecording/exportRecording.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import thirdParty from 'app/thirdParty'

@immutableRenderDecorator
export default
class TableItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            percent: 0,
            stop:false
        }
    }
    componentDidMount() {
        const {
            className,
            data,
            line,
            dispatch,
            onloading,
            handleWaitingList,
            intelligentStatus
        } = this.props
        if (onloading) {
            this.getProgress(data,handleWaitingList)
        }
    }
    componentWillReceiveProps(nextprops){
        if(nextprops.onloading && nextprops.uuidList === this.props.uuidList){
            this.getProgress(nextprops.data,nextprops.handleWaitingList)
        }
    }
     openNotification () {
      const key = `open${Date.now()}`;
      const btn = (
        <Button type="primary" size="small" onClick={() => {
            notification.close(key)
            this.props.dispatch(homeActions.addPageTabPane('SearchPanes', 'ExportRecording', 'ExportRecording', '导出记录'))
            this.props.dispatch(homeActions.addHomeTabpane('Search', 'ExportRecording', '导出记录'))
        }
        }>
          前往下载
        </Button>
      );
      notification.open({
        message: '提示',
        description:
          '附件导出已完成，链接将在48小时后失效，赶快前往“导出记录”下载吧',
        btn,
        key,
        onClose: close,
      })
    }
    getProgress(data,handleWaitingList) {
        const promise = new Promise(function(resolve, reject) {
             var result = setInterval(function() {
                fetchApi("exportEnclosureProgress", "GET", `zipUuid=${data.zipUuid}`, resp => {
                    if (showMessage(resp)) {
                        if (resp.data.percent === 100 || resp.data.percent== -1||resp.data.status==="下载中") {
                            clearInterval(result)
                        }
                        resolve(resp.data)
                    }
                })
            }, 500)
        })
        promise.then((resp) => {
            if(resp.status==="等待中"){
                this.getProgress(data,handleWaitingList)
            }else if(resp.status==="下载中"){
                this.setState({percent: resp.percent},()=>{
                    this.getProgress(data,handleWaitingList)
                })
            }else if(resp.status==="下载"){
                this.setState({percent: 100},()=>{
                    this.openNotification()
                    this.props.dispatch(exportRecordingActions.getEnclosureExportRecordingList(this.props.issuedate))
                    handleWaitingList()
                })
            }
        })

    }

    handleExportRecording(dispatch, data,onloading) {
        if(this.state.percent === 100){
            return <a  href={data.signedUrl} className='export-download' download={data.fileName}> 下载 < /a>
        }else if(onloading){
            if(this.state.percent===0){
                return data.message
            }else{
                return <Progress ref = "progress" percent = {this.state.percent} size = "small" / >
            }
        }else {
            switch (data.message) {
                case "下载":
                    return (<a href={data.signedUrl} className='export-download' download={data.fileName}> 下载 < /a>);
                default:
                    return data.message
            }
        }
    }

    render() {
        const {
            className,
            data,
            line,
            dispatch,
            uuidList,
            onloading,
            waitingList
        } = this.props
        return (
            <div>
                <CxpzTableItem
                    className = {className}
                    line = {line}
                >
                    <TableOver className = "table-item-line">
                        <Checkbox
                            disabled={waitingList.length?waitingList.includes(data.zipUuid):false}
                            checked={uuidList.includes(data.zipUuid)}
                            onClick={()=>{
                                dispatch(exportRecordingActions.handleUuidList(data.zipUuid))
                            }}
                        />
                    < /TableOver>
                    <TableOver className = "table-item-line" > {data.fileName} < /TableOver>
                    <TableOver className = "table-item-line" > {data.size>1024?`${(data.size/1024).toFixed(2)}mb`:`${data.size}kb`} < /TableOver>
                    <TableOver className = "table-item-line" > {data.createTime} < /TableOver>
                    <TableOver className = "table-item-line" > {data.userName} < /TableOver>
                    <TableOver className = "table-item-line" >
                        {this.handleExportRecording(dispatch, data,onloading)}
                    </TableOver>
                </CxpzTableItem>
            </div>
        )
    }
}
