import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { Icon, Container, ScrollView, Row, SinglePicker,Button, ButtonGroup,Checkbox ,}	from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { Modal } from 'antd-mobile';
import * as allActions from 'app/redux/Home/All/other.action'
import * as extraInformationActions from 'app/redux/Report/ExtraInformation/extraInformation.action.js'
import { Toast } from 'antd-mobile';
import './style.less'
import 'app/containers/Config/common/style/listStyle.less'
@connect(state => state)
export default
class ExtraInformation extends React.Component{
    constructor(props) {
		super(props)
		this.state = {
            visible:false
		}
	}
    componentDidMount() {
        thirdParty.setTitle({title: '附加信息设置'})
		thirdParty.setIcon({
            showIcon: false
        })
        this.props.dispatch(extraInformationActions.getExtraInformationList())

    }
    render(){
        const {
            extraInformationState,
            allState,
            dispatch,
            history
        } = this.props
        const informationList = extraInformationState.get('informationList')
        const onDeleted = extraInformationState.get('onDeleted')
        const deleteList = extraInformationState.get('deleteList')
        return(
            <Container className='extraInformation'>
                <ScrollView flex="1">
                    {informationList.map((item)=>{
                        return(
                            <div
                                className='config-list-item-wrap-style'
                                key={item.id}
                                onClick={()=>{
                                    if(onDeleted){
                                        if(!(['人均营收','人均利润','坪效'].includes(item.name) || item.enable)){
                                            dispatch(extraInformationActions.setDeleteList(item.id))
                                        }else if(['人均营收','人均利润','坪效'].includes(item.name)){
                                            Toast.info('默认项不可删除',1)
                                        }else if(item.enable){
                                            Toast.info('已启用项不可删除',1)
                                        }
                                    }else{
                                        dispatch(extraInformationActions.setExtraInfoIsChange(true))
                                        dispatch(extraInformationActions.setExtraInfoInitData(item))
                                        if(['人均营收','人均利润','坪效'].includes(item.name)){
                                            dispatch(extraInformationActions.setExtraInfoIsDefualt(true))
                                        }else{
                                            dispatch(extraInformationActions.setExtraInfoIsDefualt(false))
                                        }
                                        history.push('./extraInformationSetting')
                                    }
                                }}
                            >
                                <div className="config-list-item-style">
                                    <span className='config-list-item-checkbox-style' style={{display:onDeleted?'':'none'}}>
                                        <Checkbox
                                            className="checkbox"
                                            checked={deleteList.indexOf(item.id) > -1 ? true : false}
                                        />
                                    </span>
                                    <span className='config-list-item-info-style'>
                                        {item.name}
                                    </span>
                                    <span className='config-list-item-arrow-style'>
                                        {item.enable?'已启用':'未启用'}<Icon type='arrow-right' />
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </ScrollView>
                <ButtonGroup style={{display:onDeleted?"":'none'}}>
                    <Button
                        onClick={()=>{
                            dispatch(extraInformationActions.emptyDeleteList())
                            dispatch(extraInformationActions.changeExtraInfoListType(false))
                        }}
                    >
                        <Icon type="cancel" size='15'/><span>取消</span>
                    </Button>
                    <Button
                        disabled={!deleteList.size>0}
                        onClick={()=>{
                            this.setState({visible:true})
                        }}
                    >
                        <Icon type="delete" size='15' /><span>删除</span>
                    </Button>
                </ButtonGroup>
                <ButtonGroup style={{display:onDeleted?"none":''}}>
                    <Button onClick={()=>{
                        dispatch(extraInformationActions.setExtraInfoIsChange(false))
                        dispatch(extraInformationActions.setExtraInfoIsDefualt(false))
                        dispatch(extraInformationActions.setExtraInfoInitData())
                        history.push('./extraInformationSetting')
                    }}>
                        <Icon type="add-plus" size='15'/><span>新增</span>
                    </Button>
                    <Button
                        onClick={()=>{
                            dispatch(extraInformationActions.changeExtraInfoListType(true))
                        }}
                    >
                        <Icon type="select" size='15'/><span>选择</span>
                    </Button>
                </ButtonGroup>

                <Modal
                    transparent
                    title='确认删除吗?'
                    visible={this.state.visible}
                    onClose={()=>{
                        this.setState({visible:false})
                    }}
                    footer={[
                        {text: '取消',onPress:()=>{this.setState({visible:false})}},
                        {text: '确认', onPress: () => {
                            this.setState({visible:false})
                            dispatch(extraInformationActions.deleteExtraMessage())
                        }},
                    ]}
                >
                </Modal>
            </Container>
        )
    }
}
