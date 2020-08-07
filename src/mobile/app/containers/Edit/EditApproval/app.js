import React, { Fragment } from 'react'
import { connect }	from 'react-redux'
import { Link } from 'react-router-dom'
import { toJS, fromJS } from 'immutable'
import { SinglePicker, Row, NoticeSwitchBar, Icon, SearchBar, Container, ScrollView }  from 'app/components'
import './style.less'
import { type } from './common'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'
import SearchApproval from './SearchApproval'
import * as thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class EditApproval extends React.Component {
    state={
        searchContent:'',
        filterContent:''
    }
    componentDidMount() {
        this.props.dispatch(editApprovalActions.getApprovalList())
        thirdParty.setTitle({title: '发起审批'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({ show: false })
    }
    componentWillUnmount() {
        this.props.dispatch(editApprovalActions.changeModelString(['views','searchContent'],''))
    }
    render(){
        const {
            editApprovalState,
            history,
            dispatch
        } = this.props
        const dataList = editApprovalState.get('dataList')
        const searchContent = editApprovalState.getIn(['views','searchContent'])
        const isLoaded = editApprovalState.getIn(['views','isLoaded'])
        const isEmpty = dataList.size === 0 || dataList.every(v => !v.get('modelList').size)
        const isSearchEmpty = !isEmpty && dataList.every(v => !v.get('modelList').filter(w => searchContent?w.get('modelName').indexOf(searchContent)>-1:true).size)
        return(
            <Container style={{background:'#fff'}}>
                <div className="lrsp-tab-bar-item-top">
                    <SearchApproval
                        placeholder="搜索审批"
                        onSubmit={
                            value =>  dispatch(editApprovalActions.changeModelString(['views','searchContent'],value))
                        }
                    />
                </div>
                {
                    (isEmpty || isSearchEmpty) && isLoaded ?
                    <Row className="lrsp-container-list empty-approval" >
                        <div className="lrsp-container-list-title">审批模版</div>
                        {
                            isEmpty?
                            <Fragment>
                                <img src="https://xfn-ddy-website.oss-cn-hangzhou.aliyuncs.com/utils/img/icons/site.png" />
                                <span className='text1'>当前账套无审批单</span>
                            </Fragment>
                            :''
                        }
                        {
                            isSearchEmpty?
                            <div className='text2'>
                                未搜索到相关审批单
                            </div>:''
                        }
                    </Row>
                    :
                    <ScrollView>

                        {
                            dataList.map((v,i) =>
                                <Row className="lrsp-container-list" key={i}>
                                    <div className="lrsp-container-list-title">{v.get('groupName')}</div>
                                    <div className="tab-list">
                                        {
                                            v.get('modelList').filter(w => searchContent?w.get('modelName').indexOf(searchContent)>-1:true).map(w =>
                                                <div
                                                    key={w.get('modelCode')}
                                                    className="lrsp-container-item"
                                                    onClick={() => {
                                                        dispatch(editApprovalActions.initModel())
                                                        dispatch(editApprovalActions.getModelInfo(w.get('modelCode')))
                                                        dispatch(editApprovalActions.changeModelString(['views','title'],w.get('modelName')))
                                                        history.push('/editApproval/detail')

                                                    }}


                                                >
                                                    <span
                                                        className='icon-content'
                                                        style={{
                                                            background:{
                                                                debit:'rgb(255,131,72)',
                                                                credit:'rgb(94,129,209)',
                                                                calculate:'rgb(242,86,67)'
                                                            }[type[w.get('jrCategoryType')]] || 'rgb(255,131,72)'
                                                        }}
                                                        >
                                                        <Icon
                                                            className="icon"
                                                            type={{
                                                                debit:'fqsp-sr',
                                                                credit:'fqsp-zc',
                                                                calculate:'fqsp-nb'
                                                            }[type[w.get('jrCategoryType')]] || 'fqsp-sr'}
                                                            size="20"

                                                            color={'#fff'}
                                                        />
                                                    </span>
                                                    <p className="icon-text">{w.get('modelName')}</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </Row>
                            )
                        }
                    </ScrollView>
                }
            </Container>
        )
    }

}
