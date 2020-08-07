import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { Switch, Input, Checkbox, Button, Modal, message} from 'antd'

import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'

@immutableRenderDecorator
export default
class ModifyUnitModal extends React.Component {

	constructor() {
		super()
		this.state = { inputValue: '', conversion: '' }
	}

	render() {
        const {
			reviseModal,
            dispatch,
            tempAcItem,
			closeAcModal,
			oldAcunit
		} = this.props

		const { inputValue, conversion } = this.state

        return (
            <Modal//修改单位的组件
                okText="确定"
                visible={reviseModal}
                maskClosable={false}
                title={"修改单位"}
                onCancel={() => {
					closeAcModal()
                    this.setState({inputValue: '',conversion:''})
                }}
                footer={[
                    <Button key="cancel" type="ghost" onClick={() => {
						closeAcModal()
                        this.setState({inputValue: '',conversion:''})
                        }}>
                        取 消
                    </Button>,
                    <Button
                        key="ok"
                        type='primary'
                        onClick={() => {
                            if(conversion=='0'){
                                return message.warn('数量关系不能为0');
                            }
                            if(inputValue.length > Limit.AC_UNIT_LENGTH){
                                return message.warn(`计算单位位数不能超过${Limit.AC_UNIT_LENGTH}位`)
                            }
                            dispatch(configActions.changeAcUnitText(inputValue,conversion))
							closeAcModal()
                            this.setState({inputValue: '', conversion:''})
                        }}>
                        确定
                    </Button>
                ]}
                >
                <div className='reviseModal-item'>
                    <div className='reviseModal-item-title'>
                        <span>新单位</span>
                        <span>原单位</span>
                        <span>数量关系</span>
                    </div>
                    <div>
                        <Input
                            className="reviseModal-item-input"
                            value={inputValue}
                            onChange={(e) => {
                                this.setState({inputValue: e.target.value})
                            }}
                            placeholder="请输入新单位"
                        />
                        <span>=</span>
                        {/* <span>{tempAcItem.get('acunit')}</span> */}
                        <span>{oldAcunit}</span>
                        <span>×</span>
                        <Input
                            className="reviseModal-item-input"
                            value={conversion}
							onChange={e => {
								if ((/^[-\d]\d*\.?\d{0,3}$/g.test(e.target.value) || e.target.value === '') && e.target.value < 10000) {
									this.setState({conversion: e.target.value})
								}
							}}
                            placeholder="请输入数量关系"
                        />
                    </div>
                    <ul className='reviseModal-item-ul'>
                        <li>关于修改单位</li>
                        <li>
                            <span>大单位换小单位</span>
                            <span>例: 千克 =</span>
                            <Input
                                className="reviseModal-item-input"
                                disabled={true}
                                value={'克'}
                            />×
                            <Input
                                className="reviseModal-item-input"
                                disabled={true}
                                value={1000}
                            />
                        </li>
                        <li>
                            <span>小单位换大单位</span>
                            <span>例: 千克 =</span>
                            <Input
                                className="reviseModal-item-input"
                                disabled={true}
                                value={'吨'}
                            />×
                            <Input
                                className="reviseModal-item-input"
                                disabled={true}
                                value={0.001}
                            />
                        </li>
                        <li>
                            <span>相等单位间互算</span>
                            <span>例: 千克 =</span>
                            <Input
                                className="reviseModal-item-input"
                                disabled={true}
                                value={'公斤'}
                            />×
                            {/* 这是乘号 */}
                            <Input
                                className="reviseModal-item-input"
                                disabled={true}
                                value={1}
                            />
                        </li>
                    </ul>
                </div>
            </Modal>
        )
    }
}
