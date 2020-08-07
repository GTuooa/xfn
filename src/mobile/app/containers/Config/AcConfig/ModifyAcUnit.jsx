import React, { PropTypes }	from 'react'
import { Map } from 'immutable'
import { connect }	from 'react-redux'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import { TextInput, AmountInput, Button, ButtonGroup, Icon, Container, Row, Amount } from 'app/components'
import thirdParty from 'app/thirdParty'
import './ac-modifyUnit.less'
import * as Limit from 'app/constants/Limit.js'

@connect(state => state)
export default
class ModifyAcUnit extends React.Component {

    constructor() {
		super()
		this.state = {
			inputValue: '',
			conversion: '',
		}
	}
	componentDidMount() {
		thirdParty.setTitle({title: '修改单位'})
		thirdParty.setRight({show: false})
		this.props.dispatch(acconfigActions.changeAcShowReverseModal(false))
	}
	render() {
		const {
			allState,
			acconfigState,
			dispatch,
            history
		} = this.props
        const { inputValue, conversion } = this.state

        const ac = acconfigState.get('ac')

		return (
			<Container className="ac-unit">
                <Row flex="1">
                    <div className="ac-unit-top ac-unit-primary">
                        <span>原单位</span>
                        <span>{ac.get('oldAcunit')}</span>
                    </div>
					{/* 数字 */}
                    <div className="ac-unit-top ac-unit-equation">
                        <TextInput
                            placeholder="输入新单位..."
                            value={inputValue}
                            onChange={value => {
                                this.setState({inputValue: value})
                            }}
                        />
                        <span>=&nbsp;&nbsp;{ac.get('oldAcunit')}&nbsp;&nbsp;* </span>
                        <AmountInput
							className="ac-unit-input"
                            placeholder="输入数量关系..."
                            value={conversion}
                            onChange={value => {
								if ((/^[-\d]\d*\.?\d{0,3}$/g.test(value) || value === '') && value < 10000) {
									this.setState({conversion: value})
								}
							}}
                        />
                    </div>
                    <ul className="ac-unit-tip">
                        <li className="ac-unit-tip-dark"><span className="ac-unit-tip-left">关于数量关系：新单位＝原单位＊数量关系</span></li>
                        <li className="ac-unit-tip-dark"><span className="ac-unit-tip-left">关于修改单位：</span></li>
                        <li className="ac-unit-tip-left">小单位换大单位&nbsp;&nbsp;&nbsp;&nbsp;例：千克＝克＊1000</li>
                        <li className="ac-unit-tip-left">大单位换小单位&nbsp;&nbsp;&nbsp;&nbsp;例：克＝千克＊0.001</li>
                        <li className="ac-unit-tip-left">相等单位件互换&nbsp;&nbsp;&nbsp;&nbsp;例：千克＝公斤＊1</li>
                    </ul>
                </Row>
                <Row>
                    <ButtonGroup type='ghost' height={50}>
						<Button
                            onClick={() => {
								history.goBack()
								this.setState({inputValue: '',conversion:''})
                            }}>
                            <Icon type="cancel"/>取消
                        </Button>
						<Button
							onClick={() => {
								if(conversion == '0'){
									return thirdParty.Alert('数量关系不能为0');
								}
								if(inputValue.length > Limit.AC_UNIT_LENGTH){
									return thirdParty.Alert(`计算单位位数不能超过${Limit.AC_UNIT_LENGTH}位`)
								}
								dispatch(acconfigActions.changeAcUnitText(inputValue, conversion))
								this.setState({inputValue: '', conversion:''})
								history.goBack()
							}}
							>
							<Icon type="save"/>保存
						</Button>
					</ButtonGroup>
                </Row>
			</Container>
		)
	}
}
