import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'

import { Radio, Input, Button, Modal, message } from 'antd'
import { Icon } from 'app/components'
import ReversAcSelect from './ReversAcSelect'
import ReverseDetail from './ReverseDetail.jsx'
import AcShow from './AcShow.jsx'
import * as Limit from 'app/constants/Limit.js'
const RadioGroup = Radio.Group

@immutableRenderDecorator
export default
class ReversAc extends React.Component {

    constructor() {
        super()
        this.state = { type: 'class', inputValue: '请选择科目'}
    }

	render() {

        const {
			acCount,
			reverseAc,
			dispatch,
            acListTree,
			acListKeysArr,
			revenseAcid,
			revenseAcname,
			idNewAcReverseId,
			NewAcReverseId,
			NewAcReverseName,
			categoryList,
			openingbalance,
			canChangeClassId,
			reverseModifiable,
			reverseconfirmModalshow,
			reverseModifiModalshow,
			reverseAcselectModalshow
		} = this.props
        const { type, inputValue } = this.state

		const category = reverseAc.get('category')
		const upAcName = reverseAc.get('upAcName')
		const direction = reverseAc.get('direction')
		const upperId = reverseAc.get('upperId')
		const acunitOpen = reverseAc.get('acunitOpen')
		const cardNum = reverseAc.get('cardNum')
		const hasChildren = reverseAc.get('hasChildren')

        return (
            <Modal
                okText="保存"
                visible={reverseModifiModalshow}
                maskClosable={false}
                title={"反悔模式"}
                onCancel={() => {
                    this.setState({type: 'class', inputValue: '请选择科目'})

                    dispatch(configActions.switchReverseModifiModalShow())
                    dispatch(configActions.changeAcReverseModifiable(false))
                }}
                footer={[
                    <Button key="cancel" type="ghost" onClick={() => {
                        this.setState({type: 'class', inputValue: '请选择科目'})

                        dispatch(configActions.switchReverseModifiModalShow())
                        dispatch(configActions.changeAcReverseModifiable(false))
                        }}>
                        取 消
                    </Button>,
                    <Button
                        style={{display: reverseModifiable && type === 'class' ? '' : 'none'}}
                        key="ok"
                        type='primary'
                        onClick={() => {
							if (NewAcReverseId.length < 2)
								return message.info(`科目编码的长度应为${revenseAcid.length+2}`)
							if (NewAcReverseName === '')
								return message.info('科目名称不能为空')

							const isChinese = /[\u4e00-\u9fa5]/g
							const isChineseSign = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g
							// ： 。 ；  ， ： “ ”（ ） 、 ？ 《 》

							let acnameLimitLength = Limit.AC_CHINESE_NAME_LENGTH
							if (!isChinese.test(NewAcReverseName) && !isChineseSign.test(NewAcReverseName)) {
								acnameLimitLength = Limit.AC_NAME_LENGTH
							}

							if(NewAcReverseName.length > acnameLimitLength){
								return message.warn(`科目名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；否则，长度不能超过${Limit.AC_NAME_LENGTH}位`)
							}

							dispatch(configActions.switchReverseConfirmModalShow())
						}}>
                        信息确认
                    </Button> ,
                    <Button
                        style={{display: reverseModifiable && type === 'id' && canChangeClassId === 'true' ? '' : 'none'}}
                        key="check"
                        type='primary'
                        onClick={() => dispatch(configActions.switchReverseConfirmModalShow())}>
                        信息确认
                    </Button>
                ]}
                >

                <div className="pconfig-kmset">
                    <div className="pconfig-reverse-item">
                        <span  className="pconfig-reverse-item-label">反悔类型： </span>
                        <RadioGroup
							onChange={() => {
								this.setState({type: type === 'class' ? 'id' : 'class', inputValue: '请选择科目'})
								dispatch(configActions.changeAcReverseModifiable(false))
							}}
							value={type}
							>
                            <Radio key="a" value={'class'}>修改科目等级</Radio>
                            <Radio key="b" value={'id'}>修改科目编码</Radio>
                        </RadioGroup>
                    </div>
                    {
                        type === 'class' ?
                        <ul className="uses-tip">
                            <li>已有数据的科目新增子级科目</li>
                        </ul> :
                        ''
                    }
                    <div className="pconfig-reverse-item pconfig-reverse-item-acselect">
                        <span className="pconfig-reverse-item-label">科目选择： </span>
                        <span
							className="pconfig-reverse-item-acselect-button"
							onClick={() => dispatch(configActions.switchReverseAcSelectModaShow())}
							>
							{inputValue}
						</span>
                    </div>
                </div>
				{
					type === 'class' ?
					<div className="pconfig-kmset">
						<div className="pconfig-reverse-item">
							<label className="pconfig-reverse-item-label">上级科目：</label>
							<Input
								className="pconfig-reverse-item-input"
								disabled={true}
								value={revenseAcid ? `${revenseAcid}_${revenseAcname}` : ''}
							/>
						</div>
						<AcShow
							categoryList={categoryList}
							openingbalance={openingbalance}
							acunitOpen={acunitOpen}
							cardNum={cardNum}
							acCount={acCount}
						/>
						<ul className="uses-tip">
							<li>以上内容将转移至新增下级科目中；</li>
							<li>新增子科目时，子科目将自动继承上级科目的余额方向、类别；</li>
						</ul>
						<div className="pconfig-reverse-item">
							<label className="pconfig-reverse-item-label">新增下级科目编码：</label>
							<span className="pconfig-reverse-item-upacid">{revenseAcid}</span>
							<Input
								disabled={!reverseModifiable}
								className="pconfig-reverse-item-acidinput"
								value={NewAcReverseId}
								onChange={e => dispatch(configActions.createNewAcId(e.target.value, revenseAcid))}
							/>
						</div>
						<div className="pconfig-reverse-item">
							<label className="pconfig-reverse-item-label">新增下级科目名称：</label>
							<Input
								disabled={!reverseModifiable}
								value={NewAcReverseName}
								className="pconfig-reverse-item-input"
								placeholder={`包含中文最长${Limit.AC_CHINESE_NAME_LENGTH}个字符，否则最长${Limit.AC_NAME_LENGTH}个`}
								onChange={e => {
									// if(e.target.value.length > Limit.ALL_NAME_LENGTH)
									// 	return message.warn(`科目名称字数不能超过${Limit.ALL_NAME_LENGTH}位`)

									dispatch(configActions.createNewAcName(e.target.value))
								}}
							/>
						</div>
					</div> :
					<div className="pconfig-kmset">
						<div className="pconfig-reverse-item">
							<label className="pconfig-reverse-item-label">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目：</label>
							<Input
								className="pconfig-reverse-item-input"
								disabled={true}
								value={revenseAcid ? `${revenseAcid}_${revenseAcname}` : ''}
							/>
						</div>
						<div className="pconfig-reverse-item">
							<label className="pconfig-reverse-item-label">上级科目：</label>
							<Input
								className="pconfig-reverse-item-input"
								disabled={true}
								value={upAcName ? `${upperId}_${upAcName}` : '无'}
							/>
						</div>
						<div className="pconfig-reverse-item">
							<label className="pconfig-reverse-item-label">科目类别：</label>
							<Input
								className="pconfig-reverse-item-input"
								disabled={true}
								value={category}
							/>
						</div>
						<div className="pconfig-reverse-item">
							<label className="pconfig-reverse-item-label">余额方向：</label>
							<Input
								className="pconfig-reverse-item-input"
								disabled={true}
								value={reverseModifiable ? (direction == 'credit' ? '贷' : '借') : ''}
							/>
						</div>
						<div className="pconfig-reverse-item">
							<label className="pconfig-reverse-item-label">数量核算：</label>
							<Input
								className="pconfig-reverse-item-input"
								disabled={true}
								value={reverseModifiable ? (acunitOpen == '0' ? '无' : '有') : ''}
							/>
						</div>
						<AcShow
							categoryList={categoryList}
							openingbalance={openingbalance}
							acunitOpen={acunitOpen}
							cardNum={cardNum}
							acCount={acCount}
							hasChildren={hasChildren}
						/>
						<ul className="uses-tip">
							<li>以上内容将转移至新增科目中，原科目将被删除</li>
						</ul>
						<div className="pconfig-reverse-item">
							<label className="pconfig-reverse-item-label">科目编码修改为：</label>
							<span className="pconfig-reverse-item-upacid">{upperId}</span>
							<Input
								disabled={!reverseModifiable}
								className="pconfig-reverse-item-acidinput"
								value={idNewAcReverseId}
								onChange={e => {

									const id = e.target.value

									var re = eval("/^[0-9]*$/g")
									if (revenseAcid.length === 4) {
										if (re.test(id) && id.length < 4) {
											dispatch(configActions.changeIdNewAcReverseId(id))
											if (id.length === 3) {
												dispatch(configActions.getAcIdReverseAble(revenseAcid, upperId+''+id))
											}
										}
									} else {
										if (re.test(id) && id.length < 3) {
											dispatch(configActions.changeIdNewAcReverseId(id))
											if (id.length === 2) {
												dispatch(configActions.getAcIdReverseAble(revenseAcid, upperId+''+id))
											}
										}
									}
								}}
							/>
							<span className="pconfig-reverse-item-tip">{canChangeClassId && canChangeClassId !== 'true' ? <span><Icon type="info-circle" />{canChangeClassId}</span> : ''}</span>
						</div>
					</div>
				}
				<ReversAcSelect
					dispatch={dispatch}
					disabled={type === 'class'}
					reverseAcselectModalshow={reverseAcselectModalshow}
                    acListTree={acListTree}
					acListKeysArr={acListKeysArr}
					onSelect={(value) => {
						dispatch(configActions.switchReverseAcSelectModaShow())
						dispatch(configActions.getReportAcReverseCheck(type, value, (newValue) => this.setState({inputValue: newValue})))
					}}
				/>
				<ReverseDetail
					type={type}
					idNewAcReverseId={idNewAcReverseId}
					dispatch={dispatch}
					category={category}
					upAcName={upAcName}
					direction={direction}
					upperId={upperId}
					acunitOpen={acunitOpen}
					cardNum={cardNum}
					acCount={acCount}
					hasChildren={hasChildren}
					openingbalance={openingbalance}
					categoryList={categoryList}
					revenseAcid={revenseAcid}
					revenseAcname={revenseAcname}
					reverseconfirmModalshow={reverseconfirmModalshow}
					revenseAcid={revenseAcid}
					NewAcReverseId={NewAcReverseId}
					NewAcReverseName={NewAcReverseName}
					successCallback={() => this.setState({type: 'class', inputValue: '请选择科目'})}
				/>
            </Modal>
        )
    }
}
