import React, { Fragment } from 'react'
import { Icon, Row, Checkbox, Container, ScrollView, ButtonGroup, Button }  from 'app/components'
import { ScrollLoad } from 'app/containers/components'
import { fromJS } from 'immutable'
import { connect }	from 'react-redux'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'
import { tabs, containType } from '../common'
import SearchApproval from '../SearchApproval'
import SpdItem from './SpdItem'
import * as Limit from 'app/constants/Limit.js'
import Tabs from './Tabs'

@connect(state => state)
export default
class SearchContent extends React.Component {
    state={
        focus:false,
        isSubmit:false,
        searchHistory:localStorage.getItem("searchHistory") ? localStorage.getItem("searchHistory").split(Limit.TREE_JOIN_STR) : []
    }
    render() {
        const {
            dispatch,
            editApprovalState,
            choose,
            history
        } = this.props
        const {
            focus,
            isSubmit,
        } = this.state
        const approvalList = editApprovalState.get('approvalList')
        const views = editApprovalState.get('views')
        const selectList = views.get('selectList')
        const currentPage = views.get('currentPage')
        const pageCount = views.get('pageCount')
        const relationType = views.get('relationType')
        const processCode = views.get('processCode')
        const searchContent = views.get('searchContent')
        const componentIndex = views.get('componentIndex')
        const searchHistory = this.state.searchHistory || []
        return(
            <Container style={{background:'#fff'}}  className='spd'>
                <Tabs
                    tabs={tabs}
                    value={{
                        APPROVER:'我处理的',
                        SPONSOR:'我发起的',
                        CARBON_COPY:'抄送我的'
                    }[relationType]}
                    onChange={(item,index) => {
                        dispatch(editApprovalActions.changeModelString(['views','relationType'],['APPROVER','SPONSOR','CARBON_COPY'][index]))
                        dispatch(editApprovalActions.changeApprovalOutString('approvalList',fromJS([])))
                        // dispatch(editApprovalActions.getRelationList({ processCode, relationType:['APPROVER','SPONSOR','CARBON_COPY'][index],searchContent:'' },1))
                        history.goBack()
                    }}
                />
                <div className="search-approval">
                    <div className="lrsp-tab-bar-item-top">
                        <SearchApproval
                            needCancel
                            value={searchContent}
                            history={history}
                            placeholder="搜索标题、编号"
                            onFocus={() => this.setState({focus:true,isSubmit:false})}
                            onBlur={() => this.setState({focus:false})}
                            onChange={value => {
                                dispatch(editApprovalActions.changeModelString(['views','searchContent'],value))
                            }}
                            onSubmit={
                                (value) => {
                                    if (!value) {
                                        return
                                    }
                                    dispatch(editApprovalActions.getRelationList({ processCode, relationType, searchContent:value },1,false,'',() => {
                                        searchHistory.indexOf(value) === -1 && searchHistory.push(value)
                                        localStorage.setItem("searchHistory",searchHistory.join(Limit.TREE_JOIN_STR))
                                        this.setState({isSubmit:true,focus:false,searchHistory})
                                    }))
                                }
                            }
                        />
                    </div>
                    {
                        !focus && isSubmit?
                        <div className='spd-search-result'>
                            {`搜索结果：共${approvalList.size}条`}
                        </div>
                        :
                        <div className='spd-search-result' style={{display:searchHistory.length?'':'none'}}>
                            <span>搜索历史 </span>
                            <Icon type='cancel' onClick={() => {
                                localStorage.setItem("searchHistory",'')
                                this.setState({
                                    searchHistory:''
                                })
                            }}/>
                        </div>
                    }
                    <div className='containers' style={{background:'#fff'}} >
                        {
                            !focus && isSubmit?
                                <ScrollView>
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
                                                            searchContent={searchContent}
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
                                            <span>没有符合筛选条件的审批单</span>
                                        </div>
                                    }

                            </ScrollView>
                            :
                            <ScrollView style={{background:'#fff'}} >
                                <div className='history-list'>
                                    {
                                        searchHistory.map(v =>
                                            <span

                                                key={v}
                                                onClick={() => {
                                                    dispatch(editApprovalActions.getRelationList({ processCode, relationType, searchContent:v },1,false,'',() => {
                                                        this.setState({isSubmit:true,focus:false})
                                                    }))
                                                }}>
                                                {v}
                                            </span>
                                        )
                                    }
                                </div>
                            </ScrollView>
                        }

                    </div>
                </div>
                <div className='bottom-btn'>
                    <ButtonGroup className>
                        <Button onClick={() => {
                            dispatch(editApprovalActions.changeModelString(['componentList',componentIndex,'value'],selectList.map(v => v.get('processInstanceId'))))
                            dispatch(editApprovalActions.changeModelString(['componentList',componentIndex,'isFinshedList'],selectList.map(v => v.get('isFinshed'))))
                            dispatch(editApprovalActions.changeModelString(['componentList',componentIndex,'result'],selectList.map(v => v.get('result'))))
                            dispatch(editApprovalActions.changeModelString(['componentList',componentIndex,'titleList'],selectList.map(v => v.get('title'))))
                            history.push('/editApproval/detail')
                        }}>
                            <span>确定</span>
                        </Button>
                    </ButtonGroup>
                </div>

            </Container>
        )
    }

}
