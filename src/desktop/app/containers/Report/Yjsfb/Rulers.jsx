import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Modal, Button } from 'antd'

@immutableRenderDecorator
export default
class Rulers extends React.Component {

	render() {

		const { sfbRuleModal, onCancel, onClick } = this.props

		return (
            <Modal
                okText="保存"
                visible={sfbRuleModal}
                maskClosable={false}
                title='应交税费表取值规则：'
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" type="ghost" onClick={onClick}>
                        关 闭
                    </Button>
                ]}
                >
                <ul className="uses-tip lrb-ruler-wrap">
                    <li className="uses-tip-dark">“增值税”下的“未交增值税”取数222101（应交增值税）、222102（未交增值税），“简易计税”取数222108，“转出金融商品增值税”取数222109，“代扣代交增值税”取数222110</li>
				</ul>
            </Modal>
		)
	}
}
