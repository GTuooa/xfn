import React from 'react'
import { Modal, Radio, Button} from 'antd'

export default
class AdjustWayModal extends React.Component {
	static displayName = 'Chye WarehouseTreeModal'
	constructor() {
		super()
		this.state = {
			adjustWay: 'add'
		}
	}
	render() {
		const {
			showAdjustWayModal,
			onCancel,
			onOk,
			clearSerialList,
		} = this.props
		const { adjustWay } = this.state
		return (
			<Modal
				title="选择调整方式"
				visible={showAdjustWayModal}
				onCancel={onCancel}
				footer={[
					<Button
						type='primary'
						onClick={() => {
							onOk(adjustWay)
						}}
					>下一步</Button>
				]}
			>
				<Radio.Group
					onChange={(e)=>{
						this.setState({
							adjustWay: e.target.value
						})
						clearSerialList && clearSerialList()
					}}
					value={adjustWay}
				>
					<Radio value={'add'}>增加存货</Radio>
					<Radio value={'cut'}>减少存货</Radio></Radio.Group>
			</Modal>
		)
	}
}
