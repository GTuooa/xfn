import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Checkbox, Modal, Select, message, Button } from 'antd'
import 'app/components/Table/table.less'
import XfnIcon from 'app/components/Icon'
const Option = Select.Option
import { judgePermission } from 'app/utils'

import * as allActions from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	constructor(props) {
		super(props)
		this.state = {
			showModal:false,
			value: this.props.unitDecimalCount
		}
	}

    render() {

		const { onClick, selectAcAll, unitDecimalCount, dispatch, configPermissionInfo ,detailList} = this.props
		const { showModal, value } = this.state

        return (
            <div className="table-title-wrap">
                <ul className="accongig-tabel-width table-title">
                    <li key={0} onClick={onClick}>
                        <Checkbox checked={selectAcAll}/>
                    </li>
                    <li><span>操作</span></li>
                    <li><span>编码</span></li>
                    <li><span>名称</span></li>
                    <li><span>类别</span></li>
                    <li><span>余额方向</span></li>
                    <li><span>辅助核算</span></li>
                    <li><span>外币</span></li>
                    <li><span>计算单位&nbsp;<XfnIcon type='Config' style={{fontSize: '12px'}} onClick={() => this.setState({showModal:true})}/></span></li>
                </ul>
				<Modal//修改单位的组件
                    okText="确定"
                    visible={showModal}
                    maskClosable={false}
                    title={"数量值的保留位数"}
                    width='480px'
					onCancel={() => this.setState({showModal: false})}
					footer={[
						<Button
							key="cancel"
							onClick={() => this.setState({showModal: false})}
						>
							取消
						</Button>,
						<Button
							type="primary"
							key="ok"
							// disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
							disabled={judgePermission(detailList.get('UNIT_SETTING')).disabled}
							onClick={() => {
								if (value != unitDecimalCount) {
									dispatch(allActions.changeSystemunitDecimalCount(value, () => {this.setState({showModal: false})}, () => {this.setState({value: unitDecimalCount})}))
								} else {
									message.info('小数点后保留位数未改变')
								}
							}}
						>
							确定
						</Button>
					]}
                >
                    <div className="pconfig-kmset-item">
                        <label style={{width: '140px'}}>支持小数点后保留位数：</label>
                        <Select
                            className="pconfig-kmset-item-select"
                            value={value}
							disabled={judgePermission(detailList.get('UNIT_SETTING')).disabled}
                            style={{width:'300px'}}
                            onChange={(value) => {
                                this.setState({value: value})
                            }}
                        >
                            <Option key={0} value={'0'}>0</Option>
                            <Option key={1} value={'1'}>1</Option>
                            <Option key={2} value={'2'}>2</Option>
                            <Option key={3} value={'3'}>3</Option>
                            <Option key={4} value={'4'}>4</Option>
                        </Select>
                    </div>
                </Modal>
            </div>
        )
    }
}
