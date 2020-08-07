import React, { PropTypes }	from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import '../../style/index.less'

import { Icon, Form, Container, ScrollView, XfInput, ButtonGroup, Button, TreeSelect, PopUp } from 'app/components'
const { Label, Control, Item } = Form

// import RepentCategory from './Category'

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@connect(state => state)
export default
class RepentPattern extends React.Component {

	static displayName = 'RepentPattern'

    componentDidMount() {
        this.props.dispatch(runningConfActions.getRegretCategory())
		thirdParty.setTitle({title: '反悔模式'})
    }
    state = {
        showModal:false,
        chooseCategory:false
    }
    render() {

        const {
            dispatch,
            runningConfState,
            history,
		} = this.props
		const { showModal, chooseCategory } = this.state

		const regretCategoryList = runningConfState.getIn(['views', 'regretCategoryList'])
        const regretTemp = runningConfState.get('regretTemp')
        const runningViews = runningConfState.get('views')
		const categoryName = regretTemp.get('categoryName')
        const categoryUuid = regretTemp.get('categoryUuid')
        const hasBalance = regretTemp.get('hasBalance')
        const hasBusiness = regretTemp.get('hasBusiness')
        const subordinateName = regretTemp.get('subordinateName')

        return (
            <Container>
                <ScrollView flex="1">
                    <Form>
                        <Item label="流水类型：">
							<TreeSelect
								// disabled={isModify}
								district={regretCategoryList.toJS()}
								value={categoryName}
								onChange={(item) => {
									dispatch(runningConfActions.changeRegretTemp('categoryName', item.name))
									dispatch(runningConfActions.changeRegretTemp('categoryUuid', item.uuid))
									dispatch(runningConfActions.changeRegretTemp('hasBalance', item.hasBalance))
									dispatch(runningConfActions.changeRegretTemp('hasBusiness', item.hasBusiness))
								}}
							>
								<div
									className="ac-kmset-item"
								>
									<div>{categoryName}<Icon type="arrow-right" className="ac-reverse-icon"/></div>
								</div>
							</TreeSelect>
                        </Item>
                            <div className="account-regret-modal-text"><p>已有数据的流水类别新增下级类别</p></div>
							{
								categoryUuid?
								<div className='regret-modal-hadMsg-content'>
									<p>该类别已有数据：</p>
									<ul>
										{
											hasBalance?
											<li>期初余额数据</li>:''
										}
										{
											hasBusiness?
											<li>流水数据</li>:''
										}
									</ul>
								</div>:''
							}
							{
								categoryUuid?
								<div className="account-regret-modal-text"><p>以上数据将转移至新增下级类别中</p></div>:''
							}
							{
								categoryUuid?
								<Item label="下级类别名称：">
									<XfInput.BorderInputItem
										textAlign="right"
										value={subordinateName}
										placeholder={"点击填写下级类别"}
										onChange={value => dispatch(runningConfActions.changeRegretTemp('subordinateName', value))}
									/>
								</Item>:''
							}
                    </Form>
                </ScrollView>
				<PopUp
					title={'信息确认'}
					visible={showModal}
					footerVisible={true}
					onCancel={() => {
						this.setState({showModal:false})
					}}
					onOk={() => {
						dispatch(runningConfActions.saveRegretMessage(history))
					}}
				>
					<div className="orderform regret-modal-content">
						<p>
							1、原【{categoryName}】的数据将转移至【{subordinateName}】，数据如下:
							</p>
							<ul>
							{
								hasBalance ?
									<li>期初余额数据</li> :''
							}
							{
								hasBusiness?
									<li>流水数据</li> :''
							}
							</ul>
						<p>2、【{categoryName}】可新增下级类别。</p>
					</div>
				</PopUp>
                <ButtonGroup>
                    <Button
                        // disabled={!editPermission}
                        onClick={() => history.goBack()}>
                        <Icon type="cancel"/><span>取消</span>
                    </Button>
                    <Button
                        // disabled={!editPermission}
                        onClick={() => {
                            if(subordinateName && categoryName) {
                                this.setState({showModal:true})
                            } else {
                                thirdParty.toast.info('请填写完善的信息',1)
                            }
                        }}>
                        <Icon type="confirm" size='15'/><span>信息确认</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}

// {/* <div className='am-action-sheet-mask'
// 	style={{display:showModal?'':'none'}}
// 	onClick={() => this.setState({showModal:false})}
// ></div>
// <div className='repent-modal' style={{display:showModal?'':'none'}}>
// 	<div className='modal-title'>信息确认</div>
// 	<div className='modal-content regret-modal-content'>
// 		<p>
// 			1、原【{categoryName}】的数据将转移至【{subordinateName}】，数据如下:
// 		</p>
// 		<ul>
// 			{
// 				hasBalance?
// 				<li>期初余额数据</li>:''
// 			}
// 			{
// 				hasBusiness?
// 				<li>流水数据</li>:''
// 			}
// 		</ul>
// 		<p>2、【{categoryName}】可新增下级类别。</p>
// 	</div>
// 	<div className='modal-foot'>
// 		<ButtonGroup >
// 			<Button
// 				// disabled={!editPermission}
// 				onClick={() => this.setState({showModal:false})}>
// 				<Icon type="cancel"/><span>取消</span>
// 			</Button>
// 			<Button
// 				// disabled={!editPermission}
// 				onClick={() => dispatch(runningConfActions.saveRegretMessage(history))}>
// 				<Icon type="confirm" size='15'/><span>确定</span>
// 			</Button>
// 		</ButtonGroup>
// 	</div>
// </div> */}
// // </div>
