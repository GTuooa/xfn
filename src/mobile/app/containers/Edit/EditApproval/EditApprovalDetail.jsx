import React, { Component,Fragment }  from 'react'
import { connect }	from 'react-redux'
import { fromJS, List } from 'immutable'
import PropTypes from 'prop-types'
import * as Limit from 'app/constants/Limit.js'
import { decimal, formatMoney, numberFourTest } from 'app/utils'
import { CategoryComp, InventoryComp, CommonChoose, CommonInput, CommonRow, UploadPic, SpdComp } from './components'
import { Row, Container, ScrollView, Icon, ButtonGroup, Button }  from 'app/components'
import './style.less'
import { type, formType, jrType } from './common'
import * as thirdParty from 'app/thirdParty'

import { homeActions } from 'app/redux/Home/home.js'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

// import VConsole from 'vconsole'
//  new VConsole()
@connect(state => state)
export default class EditApprovalDetail extends Component {
    componentDidMount() {
        this.props.dispatch(homeActions.setDdConfig())
        const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
		scrollViewHtml.addEventListener('scroll', function(e) {
			const scrollHeight = e.target.scrollHeight
			const clientHeight = e.target.clientHeight
			if (scrollHeight <= clientHeight) {//个别机型在滚动条消失时没有回到最顶端导致页面被遮住
				e.target.scrollTop = 0
			}
		}, false);
        const title = this.props.editApprovalState.getIn(['views','title'])
        thirdParty.setTitle({title})
    }
    // componentWillUnmount() {
    //     this.props.dispatch(editApprovalActions.initModel())
    // }
    render() {
        const { dispatch, history, editApprovalState } = this.props
        const componentList = editApprovalState.get('componentList')
        const modelInfo = editApprovalState.get('modelInfo')
        const categoryList = editApprovalState.get('categoryList') || fromJS([])
        const categoryCardList = editApprovalState.get('categoryCardList') || fromJS([])
        const currentCardTree = editApprovalState.get('currentCardTree') || fromJS([])
        const currentCardList = editApprovalState.get('currentCardList') || fromJS([])
        const stockCardTree = editApprovalState.get('stockCardTree') || fromJS([])
        const stockCardList = editApprovalState.get('stockCardList') || fromJS([])
        const projectCardTree = editApprovalState.get('projectCardTree') || fromJS([])
        const projectCardList = editApprovalState.get('projectCardList') || fromJS([])
        const spaceId = editApprovalState.get('spaceId')
        const uploadKeyJson = editApprovalState.get('uploadKeyJson')
        const chIndex = componentList.findIndex(v => v.get('jrComponentType') === 'MX' &&  v.getIn(['detailList',0]).some(w => w.get('jrComponentType') === 'CH'))
        return(
            <Container className='edit-approval'>
                <ScrollView className='approval-view' flex='1'>
                    {
                        componentList.map((v,index) => {
                            if (v.get('jrComponentType') === 'MX') {
                                const totalAmount = v.get('detailList')
                                if (chIndex > -1) {
                                    return (
                                        <Fragment key={v.get('componentId')}>
                                            <InventoryComp
                                                item={v}
                                                dispatch={dispatch}
                                                key={v.get('componentId')}
                                                district={stockCardTree}
                                                cardList={stockCardList}
                                                modelInfo={modelInfo}
                                                index={index}
                                                history={history}
                                            />
                                            <div className='mx-title' style={{paddingTop:0}}>
                                                <span>总计：{formatMoney(v.get('detailList').reduce((pre,cur) =>
                                                    pre + Number(cur.find(z => z.get('jrComponentType') === 'MX_AMOUNT').get('amount') || 0),0)
                                                )}
                                                </span>
                                            </div>
                                        </Fragment>
                                    )
                                } else {
                                    return(
                                        <Fragment key={v.get('componentId')}>
                                            {
                                                v.get('detailList').map((w,i)=>
                                                    <Fragment key={i}>
                                                        <div className='mx-title'>
                                                            <span>明细（{i+1}）</span>
                                                            {
                                                                v.get('detailList').size > 1?
                                                                <span
                                                                    style={{color:'#5e81d1'}}
                                                                    onClick={() => {
                                                                        const newList = v.get('detailList').splice(i,1)
                                                                        dispatch(editApprovalActions.changeModelString(['componentList',index,'detailList'],newList))
                                                                    }}
                                                                >
                                                                        删除
                                                                </span>:''
                                                            }

                                                        </div>
                                                        {
                                                            w.map((item,innerIndex) => {
                                                                const district = {
                                                                    LSLB:categoryList,
                                                                    WLDW:currentCardTree,
                                                                    XM:projectCardTree,
                                                                    BM:(item.get('extraSelectValueList') || fromJS([])).map(v => v.set('key',v.get('name')).set('value',v.get('name')))
                                                                }[item.get('jrComponentType')] || fromJS([])
                                                                const cardList = {
                                                                    LSLB:categoryList,
                                                                    XM:projectCardList,
                                                                    WLDW:currentCardList
                                                                }[item.get('jrComponentType')] || fromJS([])
                                                                const type = {
                                                                    MoneyField:'money',
                                                                    NumberField:'number'
                                                                }[item.get('componentType')]
                                                                const Comp = jrType[item.get('jrComponentType')] || formType[item.get('componentType')] || CommonRow
                                                                return(
                                                                    <Comp
                                                                        isMx
                                                                        className={`mx-item ${innerIndex === w.size-1?'no-margin-bottom':''}`}
                                                                        item={item}
                                                                        dispatch={dispatch}
                                                                        key={item.get('componentId')}
                                                                        label={item.get('label')}
                                                                        placeHolder={item.get('placeHolder')}
                                                                        district={district}
                                                                        cardList={cardList}
                                                                        jrComponentType={v.get('jrComponentType')}
                                                                        modelInfo={modelInfo}
                                                                        type={type}
                                                                        size={v.get('detailList').size}
                                                                        index={index}
                                                                        innerIndex={innerIndex}
                                                                        idx={i}
                                                                        itemList={v.get('detailList')}
                                                                        placeArr={['componentList',index,'detailList',i,innerIndex]}
                                                                        onChange={value => {
                                                                            dispatch(editApprovalActions.changeModelString(['componentList',index,'detailList',i,innerIndex,'value'],value))

                                                                        }}
                                                                        history={history}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </Fragment>
                                                )}
                                                <div className='mx-icon' onClick={() => {
                                                    dispatch(editApprovalActions.changeModelString(['componentList',index,'detailList',v.get('detailList').size],v.getIn(['detailList',0]).map(v => v.set('value','').set('name','').set('code',''))))

                                                }}>
                                                    <Icon type='add' />
                                                </div>
                                                <div className='mx-title' style={{paddingTop:0}}>
                                                    <span>总计：{formatMoney(v.get('detailList').reduce((pre,cur) =>
                                                        pre + Number(cur.find(z => z.get('jrComponentType') === 'MX_AMOUNT').get('value') || 0),0)
                                                    )}
                                                    </span>

                                                </div>
                                        </Fragment>
                                    )

                                }

                            } else {
                                const item = v
                                const district = {
                                    LSLB:categoryList,
                                    WLDW:currentCardTree,
                                    XM:projectCardTree,
                                    BM:(item.get('extraSelectValueList') || fromJS([])).map(v => v.set('key',v.get('name')).set('value',v.get('name')))
                                }[item.get('jrComponentType')] || fromJS([])
                                const cardList = {
                                    LSLB:categoryList,
                                    XM:projectCardList,
                                    WLDW:currentCardList
                                }[item.get('jrComponentType')] || fromJS([])
                                const type = {
                                    MoneyField:'money',
                                    DDMultiSelectField:'multiple',
                                    NumberField:'number'
                                }[item.get('componentType')]
                                const Comp = jrType[item.get('jrComponentType')] || formType[item.get('componentType')] || CommonRow
                                return(
                                    <Comp
                                        style={v.get('label') === v.get('dateRangeLabelFirst') && v.get('componentType') === 'DDDateRangeField'?{marginBottom:0,borderBottom:'1px solid #eee'}:{}}
                                        uploadKeyJson={uploadKeyJson}
                                        spaceId={spaceId}
                                        item={item}
                                        dispatch={dispatch}
                                        key={item.get('componentId')}
                                        label={item.get('label')}
                                        placeHolder={item.get('placeHolder')}
                                        district={district}
                                        cardList={cardList}
                                        jrComponentType={v.get('jrComponentType')}
                                        modelInfo={modelInfo}
                                        type={type}
                                        history={history}
                                        placeArr={['componentList',index]}
                                        index={index}
                                        onChange={value => {
                                            if (item.get('componentType') === 'DDDateRangeField') {
                                                if (v.get('label') === v.get('dateRangeLabelFirst') && componentList.getIn([index+1,'value']) && value > componentList.getIn([index+1,'value'])) {
                                                    thirdParty.toast.info(v.get('label')+'不得大于'+componentList.getIn([index+1,'label']))
                                                    return
                                                } else if (v.get('label') === v.get('dateRangeLabelLast') && componentList.getIn([index-1,'value']) && value < componentList.getIn([index-1,'value'])) {
                                                    thirdParty.toast.info(componentList.getIn([index-1,'label'])+'不得大于'+v.get('label'))
                                                    return
                                                }
                                            }
                                            dispatch(editApprovalActions.changeModelString(['componentList',index,'value'],value))
                                            if (item.get('jrComponentType') === 'BM') {
                                                let bmItem = componentList.find(v => v.get('jrComponentType') === 'BM')
                                                const extraSelectValueList = bmItem.get('extraSelectValueList')
                                                const departmentId = extraSelectValueList.find(v => v.get('name') === value).get('id')
                                                dispatch(editApprovalActions.changeModelString(['views','departmentId'],departmentId))
                                            }

                                        }}
                                    />
                                )
                            }

                        })
                    }
                </ScrollView>
                <div className='bottom-btn'>
                <ButtonGroup>
                    <Button onClick={() => {
                        let mes = []
                        componentList.forEach(v => {
                            if (!v.get('value') && v.get('required')) {
                                mes.push(v.get('label'))
                            }
                            if (v.get('detailList') && v.get('detailList').size) {
                                v.get('detailList').map(w => w.map(z => {
                                    if (!z.get('value') && z.get('required')) {
                                        mes.push(z.get('label'))
                                    }
                                }))
                            }
                        })
                        if (chIndex > -1 && componentList.getIn([chIndex,'detailList']).some(w => {
                            const amountItem = w.find(v => v.get('jrComponentType') === 'MX_AMOUNT')
                            return w.getIn([0,'unit','name']) && !amountItem.get('unit')
                        })) {
                            mes.push('单位')
                        }
                        if (chIndex > -1 && !componentList.getIn([chIndex,'detailList']).every(w => {
                            const amountItem = w.find(v => v.get('jrComponentType') === 'MX_AMOUNT')
                            return amountItem.get('amount') > 0})) {
                                mes.push('金额')
                        }
                        if (mes.length) {
                            thirdParty.toast.info(Array.from(new Set(mes)).join('、') + '不能为空')
                            return
                        }
                        dispatch(editApprovalActions.saveApprovalItem(() => dispatch(editApprovalActions.initModel(modelInfo.get('modelCode')))))
                    }}>
						<span>提交</span>
					</Button>
                </ButtonGroup>
                </div>
            </Container>
        )
    }
}
