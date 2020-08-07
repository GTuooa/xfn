import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'
import './style/index.less'

import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { Icon, Select, Button, Input, Checkbox,Progress} from 'antd'
import * as exportRecordingActions from 'app/redux/Search/ExportRecording/exportRecording.action'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action.js'
const InputGroup = Input.Group;
const { Option } = Select;
@immutableRenderDecorator
export default
class Title extends React.Component {
    constructor(props){
        super(props)
        this.state={

        }
    }
    render(){

        const {dispatch,refresh,uuidList,intelligentStatus}=this.props

        return(
            <FlexTitle>
                <div className='flex-title-left'></div>
                <div className='flex-title-right'>
                    <Button type="ghost" disabled={!uuidList.size} className="title-right-btn" onClick={()=>{
                        dispatch(exportRecordingActions.deleteExportList())
                    }}>删除</Button>
                    <Button type="ghost" className="title-right-btn" onClick={()=>{
                        if(intelligentStatus){
                            dispatch(homeActions.addPageTabPane('SearchPanes', "RunningEnclosure", "RunningEnclosure", "附件管理"))
                            dispatch(homeActions.addHomeTabpane("Search", "RunningEnclosure", "附件管理"))
                        }else{
                            dispatch(homeActions.addPageTabPane('SearchPanes', 'Fjgl', 'Fjgl', '附件管理'))
							dispatch(homeActions.addHomeTabpane('Search', 'Fjgl', '附件管理'))
							dispatch(cxpzActions.setFjglData())
                        }
                    }}>附件管理</Button>
                    <Button
                        type="ghost"
                        className="title-right-btn"
                        onClick={()=>{
                            refresh()
                    }}>刷新</Button>
                </div>
            </FlexTitle>
        )
    }
}
