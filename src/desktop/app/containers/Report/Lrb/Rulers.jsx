import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Modal, Button } from 'antd'

@immutableRenderDecorator
export default
class Rulers extends React.Component {

	render() {

		const { lrbRuleModal, onCancel, onClick } = this.props
		
		return (
            <Modal
                okText="保存"
                visible={lrbRuleModal}
                maskClosable={false}
                title='利润表取值规则'
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" type="ghost" onClick={onClick}>
                        关 闭
                    </Button>
                ]}
                >
                <ul className="uses-tip lrb-ruler-wrap">
                    <li className="uses-tip-dark">1、营业税金及附加下的其中内的”消费税“取数540301，”城市维护建设税“取数540302，”资源税“取数540310，“土地增值税”取数540305，“城镇土地使用税、房产税、车船税、印花税”取数540306+540307+540308+540309，“教育费附加、矿产资源补偿费、排污费”取数540303+540304+540311+540312；</li>
                    <li className="uses-tip-dark">2、销售费用取数5601，销售费用下的其中内的”商品维修费“取数560107，”广告费和业务宣传费“560115；</li>
                    <li className="uses-tip-dark">3、管理费用取数5602，管理费用下的其中内的”开办费“取数560221，”研究费用“取数560222，”业务招待费“取数560214；</li>
                    <li className="uses-tip-dark">4、财务费用取数5603，财务费用下的其中内的”利息费用“取数560301；</li>
                    <li className="uses-tip-dark">5、营业外收入取数5301，营业外收入下的其中内的”政府补助“取数530107；</li>
                    <li className="uses-tip-dark">6、营业外支出取数5711，营业外支出下的其中内的”坏账损失“取数571103，“无法收回的长期债券投资损失”取数571104，“无法收回的长期股权投资损失”取数571105，“自然灾害等不可抗力因素造成的损失”取数571106，”税收滞纳金“取数571107；</li>
                    <li className="uses-tip-dark">7、所得税费用取数5801。</li>
                    <div className="uses-tip-dark-blod">如您创建账套的模板为”小企业账套（推荐）“，建议对上述科目编码及名称不做修改（添加子科目或辅助核算不受影响）；如确实无需使用，也可删除，但新增其他自定义科目时请避免使用上述代码。</div>
                    <div className="uses-tip-dark-blod">如创建的模板是空账套，建议按上述科目编码按需要创建相应的科目，如涉及凭证导入，也需相应调整导入凭证涉及上述科目对应的科目编码。</div>
                </ul>
            </Modal>
		)
	}
}
