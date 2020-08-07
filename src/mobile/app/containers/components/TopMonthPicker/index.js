import React, { Component, PropTypes }  from 'react'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, SwitchText, SinglePicker } from 'app/components'
import browserNavigator from 'app/utils/browserNavigator'
import * as thirdParty from 'app/thirdParty'

import '../TopDatePicker/index.less'

export default
class TopMonthPicker extends Component {

    constructor() {
        super()
        this.state = {
			isCross: false//是否跨期
		}
    }
    // onChange = (value) => {
    //     console.log(value);
    //     this.setState({
    //         value,
    //     });
    // }
    // onScrollChange = (value) => {
    //     console.log(value);
    // }

    render() {

        const {
            issuedate,
			endissuedate,
			nextperiods,
			source,
			onOk,
			onCancel,
			callback,
			className,
			showSwitch,
			onBeginOk,
			onEndOk,
			changeEndToBegin
        } = this.props
        const { isCross } = this.state

		const issuedateshow = issuedate ? issuedate.replace('-', '/') : ''
		const endIssueDateShow = endissuedate ? endissuedate.replace('-', '/') : ''
		const firstDate = source.getIn([0,'value'])
        const lastDate = source.getIn([source.size - 1,'value'])

		const issue = source.filter(v => v.get('value') === issuedate)
		const issuedateEx = issue.size === 0 ? false : true

        return (
            <Row className="date-header-wrap">
				{
					(isCross || endissuedate) ?
					// 有跨账期的显示
					<div
                        className="date-header"
                        //style={{'marginRight': showSwitch ? '.5rem' : ''}}
                    >
                        {
                            source.size === 0 ?
                            <div
                                className="thirdparty-date-select"
                                onClick={() => {
                                    thirdParty.Alert('当前账套无凭证，请点击新增按钮或前往录入凭证页新增凭证')
                                }}
                            >
                                <span className="thirdparty-date-date">{issuedateshow}</span>
                                <Icon type="triangle" size="11" />
                            </div> :
                            <SinglePicker
                                className="thirdparty-date-select"
                                district={source.toJS()}
                                value={issuedate}
                                onOk={onBeginOk}
                            >
                                <span>
                                    <span className="thirdparty-date-date">{issuedateshow}</span>
                                    <Icon type="triangle" size="11" />
                                </span>
                            </SinglePicker>
                        }
						<span>至</span>
                        {
                            nextperiods.size === 0 ?
                            <div
                                className="thirdparty-date-select"
                                onClick={() => {
                                    thirdParty.Alert('当前已为最后一期', '好的')
                                }}
                            >
                                <span className="thirdparty-date-date">{endIssueDateShow}</span>
                                <Icon type="triangle" size="11" color={nextperiods.size === 0 ? '#ccc' : ''}/>
                            </div> :
                            <SinglePicker
                                district={nextperiods.toJS()}
                                value={endissuedate}
                                onOk={onEndOk}
                                className="thirdparty-date-select"
                            >
                                <span>
                                    <span className="thirdparty-date-date">{endIssueDateShow}</span>
                                    <Icon type="triangle" size="11" color={nextperiods.size === 0 ? '#ccc' : ''} />
                                </span>
                            </SinglePicker>
                        }
						{/* <div className="thirdparty-date-select"
							onClick={() => {
								if (nextperiods.size === 0) {
									thirdParty.Alert({
										message: '当前已为最后一期',
										buttonName: '好的'
									})
									return
								}
								thirdparty.chosen({
									source: nextperiods,
									onSuccess: onEndOk,
									onFail: onCancel
								})
							}}
							>
							<span className="thirdparty-date-date">{endIssueDateShow}</span>
							<Icon type="triangle" size="11" color={nextperiods.size === 0 ? '#ccc' : ''} />
						</div> */}
					</div>
					:
					// 无跨账期的显示
					<div className="date-header">
						<span
							className="date-header-btn-wrap"
							onClick={() => {
								if (issuedate == lastDate || issuedateEx === false) {
									return
								} else {
									source.map((v, i) => {
										if (v.get('value') == issuedate) {
											const newdata = source.get(i + 1).toJS()
											callback(newdata.value)
										}
									})
								}
							}}
						>
							<Icon
								type="last"
								className="header-left"
								// style={issuedate == lastDate || issuedateEx === false ? {color: '#8fddff'} : ''}
								style={issuedate == lastDate || issuedateEx === false ? {color: '#ccc'} : ''}
							></Icon>
						</span>
                        {
                            source.size === 0 ?
                            <div
                                className="thirdparty-date-select"
                                onClick={() => {
                                    thirdParty.Alert('当前账套无凭证，请点击新增按钮或前往录入凭证页新增凭证', '确认')
                                }}
                            >
                                <span className="thirdparty-date-date">{issuedateshow}</span>
                                <Icon type="triangle" size="11" />
                            </div> :
                            <SinglePicker
                                className="thirdparty-date-date"
                                district={source.toJS()}
                                value={issuedate}
                                onOk={onOk}
                            >
                                <span>
                                    <span>{issuedateshow}</span>
                                    <Icon type="triangle" size="11" />
                                </span>
                            </SinglePicker>
						}
						<span
							className="date-header-btn-wrap"
							onClick={() => {
								if (issuedate === firstDate || issuedateEx === false) {
									return
								} else {
									source.map((v, i) => {
										if (v.get('value') === issuedate) {
											const newdata = source.get(i - 1).toJS()
											callback(newdata.value)
										}
									})
								}
							}}
						>
							<Icon
								className="header-right"
								type="next"
								// style={issuedate == firstDate || issuedateEx === false ? {color: '#8fddff'} : ''}
								style={issuedate == firstDate || issuedateEx === false ? {color: '#ccc'} : ''}
							/>
						</span>
					</div>
				}
				{
					showSwitch ?
                    <Icon
                        type="date"
                        className='topBarIcon'
                        onClick={()=>{
                            if(endissuedate){//存在end时 由跨期变为单期
                                changeEndToBegin()
                                this.setState({isCross: false})
                            }else{//不存在end
                                if(isCross){//由跨期变为单期使end为空
                                    changeEndToBegin()
                                }
                            this.setState({isCross: !isCross})
                            }
                        }}
                    />
					// <SwitchText
					// 	checked={isCross || endissuedate}
					// 	checkedChildren="跨期"
					// 	unCheckedChildren="单期"
					// 	className='topBarSwitch'
					// 	onChange={() => {
					// 		if(endissuedate){//存在end时 由跨期变为单期
					// 			changeEndToBegin()
					// 			this.setState({isCross: false})
					// 		}else{//不存在end
					// 			if(isCross){//由跨期变为单期使end为空
					// 				changeEndToBegin()
					// 			}
					// 			this.setState({isCross: !isCross})
					// 		}
					// 	}}
					// />
                    : ''
				}
            </Row>
        )
    }
}
