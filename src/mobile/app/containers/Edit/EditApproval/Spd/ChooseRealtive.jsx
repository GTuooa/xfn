import React, { Fragment } from 'react'
import { Icon, Row, Checkbox, ScrollView, Container, ButtonGroup, Button }  from 'app/components'
import { ScrollLoad } from 'app/containers/components'
import { fromJS } from 'immutable'
import { connect }	from 'react-redux'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'
import SearchType from './SearchType'
import SpdItem from './SpdItem'
import { tabs, containType } from '../common'
import Tabs from './Tabs'

@connect(state => state)
export default
class ChooseRealtive extends React.Component {
    state={
        searching:false,
        selecting:false,
    }
    componentDidMount() {
        const views = this.props.editApprovalState.get('views')
        const processCode = views.get('processCode')
        const relationType = views.get('relationType')
        this.props.dispatch(editApprovalActions.getRelationList({ processCode, relationType,searchContent:'' },1))
        this.props.dispatch(editApprovalActions.getApprovalProcessModelList({}))
    }
    render() {
        const {
            editApprovalState,
            dispatch,
            history
        } = this.props
        const {
            searching,
            selecting
        } = this.state
        const processModelList = editApprovalState.get('processModelList')
        const approvalList = editApprovalState.get('approvalList')
        const views = editApprovalState.get('views')
        const currentPage = views.get('currentPage')
        const pageCount = views.get('pageCount')
        const searchContent = views.get('searchContent')
        const processCode = views.get('processCode')
        const relationType = views.get('relationType')
        const selectList = views.get('selectList')
        const componentIndex = views.get('componentIndex')
		const modelName = views.get('modelName')
        return(
            <Container className='spd'>
                <Tabs
                    tabs={tabs}
                    value={{
                        APPROVER:'我处理的',
                        SPONSOR:'我发起的',
                        CARBON_COPY:'抄送我的'
                    }[relationType]}
                    onChange={(item,index) => {
                        dispatch(editApprovalActions.getRelationList({ processCode, relationType:['APPROVER','SPONSOR','CARBON_COPY'][index],searchContent:'' },1))
                    }}
                />
                <div className="search-approval">
                    <Row>
                        <div className='spd-search'>
                            <span onClick={() => history.push('/editApproval/search/content')}><Icon type='search'/>搜索</span>
                            <span onClick={() => history.push('/editApproval/search/type')} style={processCode?{color:'#5e81d1'}:{}}><Icon type='select' />筛选</span>
                        </div>

                    </Row>
                    {
                        processCode?
                        <div className='spd-search-result'>
                            <span>
                                {`搜索结果：${modelName}`}
                            </span>
                            <Icon type='cancel' onClick={() => {
                                dispatch(editApprovalActions.getRelationList({ processCode:'', relationType,searchContent:'' },1))
                                dispatch(editApprovalActions.changeModelString(['views','modelName'],''))
                            }}/>
                        </div>:''
                    }
                    <div className='containers'>
                        <ScrollView >
                            {
                                approvalList.size?
                                <Fragment>
                                    <div className='flow-content'>
                                        {
                                            approvalList.map((v,i) =>
                                                <SpdItem
                                                    key={i}
                                                    v={v}
                                                    i={i}
                                                    dispatch={dispatch}
                                                    selectList={selectList}
                                                />
                                            )
                                        }
                                    </div>

                                    <ScrollLoad
                                        diff={1}
                                        classContent='flow-content'
                                        callback={(_self) => {
                                            dispatch(editApprovalActions.getRelationList({ processCode, relationType, searchContent },currentPage+1,true,_self))
                                        }}
                                        isGetAll={currentPage >= pageCount}
                                        itemSize={approvalList.size}
                                    />
                                </Fragment>
                                :
                                <div className='empty-approval'>
                                    <Icon type='empty-spd'/>
                                    <span>{processCode?'没有符合筛选条件的审批单':`没有${{
                                        APPROVER:'我处理',
                                        SPONSOR:'我发起',
                                        CARBON_COPY:'抄送我'
                                    }[relationType]}的审批单`}</span>
                                </div>
                            }
                        </ScrollView>
                    </div>
                </div>
                <div className='bottom-btn'>
                    <ButtonGroup className>
                        <Button onClick={() => {
                            dispatch(editApprovalActions.changeModelString(['componentList',componentIndex,'value'],selectList.map(v => v.get('processInstanceId'))))
                            dispatch(editApprovalActions.changeModelString(['componentList',componentIndex,'isFinshedList'],selectList.map(v => v.get('isFinshed'))))
                            dispatch(editApprovalActions.changeModelString(['componentList',componentIndex,'titleList'],selectList.map(v => v.get('title'))))
                            dispatch(editApprovalActions.changeModelString(['componentList',componentIndex,'result'],selectList.map(v => v.get('result'))))

                            history.goBack()
                        }}>
                            <span>确定</span>
                        </Button>
                    </ButtonGroup>
                </div>
            </Container>
        )
    }
}
