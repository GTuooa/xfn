import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { Icon, Container, ScrollView, Single,Button, ButtonGroup,Checkbox ,Form,TextInput,Switch,Row,TextListInput}from 'app/components'
import * as thirdParty from 'app/thirdParty'
const { Item } = Form
import * as allActions from 'app/redux/Home/All/other.action'
import 'app/containers/Config/common/style/listStyle.less'
import * as extraInformationActions from 'app/redux/Report/ExtraInformation/extraInformation.action.js'
import { Toast } from 'antd-mobile';

@connect(state => state)
export default
class ExtraInformationSetting extends React.Component {
    componentDidMount() {
		thirdParty.setTitle({title: '修改附加信息'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})
	}
    render(){
        const {
            extraInformationState,
            allState,
            dispatch,
            history
        } = this.props
        const name = extraInformationState.get("name")
        const denominatorName = extraInformationState.get("denominatorName")
        const denominatorValue = extraInformationState.get("denominatorValue")
        const enable = extraInformationState.get("enable")
        const numerator = extraInformationState.get("numerator")
        const list = [
            {key:'营业收入',value:1},
            {key:'营业利润',value:5},
            {key:'营业净利润',value:9},
            {key:'营业成本',value:2},
        ]
        const isChange = extraInformationState.get("isChange")
        const isDefault = extraInformationState.get("isDefault")

        return(
            <Container className='extra-info-setting'>
                <ScrollView flex="1">
                    <Form>
                        <Item label="名称" showAsterisk={!isDefault} className={"config-form-item-input-style"}>
                            {isDefault?
                                <div style={{color:'#ccc'}}>{name}</div>
                                :<TextInput
                                placeholder='请输入名称'
                                disabled={isDefault}
                                value={name}
                                //maxLength='6'
                                onChange={(value) => {
                                    dispatch(extraInformationActions.changeName(value))
                                }}
                            />
                        }
                        </Item>
                        <Item label="运算项分子" className="config-form-item-input-style">
                            <Single
                                district={list}
                                value={numerator}
                                disabled={isDefault}
                                onOk={(value) => {
                                    dispatch(extraInformationActions.changeNumerator(value.value))
                                }}
                            >
                                <Row className={isDefault?'config-form-item-select-item config-form-item-disabled' :'config-form-item-select-item' }>
                                    {list.find(v=>v.value===numerator).key}
                                </Row>
                            </Single>
                            &nbsp;<Icon type="arrow-right" size="14" style={{color:isDefault?'rgb(204, 204, 204)':''}}/>
                        </Item>
                        <Item label="运算项分母" showAsterisk={!isDefault} className="config-form-item-input-style">
                            <TextListInput
                                placeholder={isDefault?name==='坪效'?'请输入面积':'请输入人数':'请输入分母'}
                                //type="digit"
                                //pattern="[0-9.]*"
                                value={denominatorValue}
                                onChange={(value) => {
                                    if(value===''){
                                        dispatch(extraInformationActions.changeDenomiatorValue(value))
                                    }else{
                                        if(/^\d*\.?\d{0,2}$/g.test(value)){
                                                // if(value.indexOf('.')!= -1){
                                                //     if(value.split('.')[1].length<3){
                                                //         dispatch(extraInformationActions.changeDenomiatorValue(value))
                                                //     }
                                                // }else{
                                                dispatch(extraInformationActions.changeDenomiatorValue(value))
                                                //}

                                        }
                                    }
                                }}
                            />
                        </Item>
                        <Item label="单位" showAsterisk={!isDefault} className={isDefault?'config-form-item-input-style-disabled':"config-form-item-input-style"}>
                            {isDefault?
                                <div style={{color:'#ccc'}}>{denominatorName}</div>
                                :<TextInput
                                    placeholder='请输入单位'
                                    value={denominatorName}
                                    disabled={isDefault}
                                    //maxLength='6'
                                    onChange={(value) => {
                                        dispatch(extraInformationActions.changeDenominatorName(value))
                                    }}
                                />}
                        </Item>
                        <Item label="启用/停用" className="config-form-item-input-style">
                            <span className="noTextSwitchShort">
                                <Switch
                                    checked={enable}
                                    onClick={()=> {
                                        dispatch(extraInformationActions.changeSettingEnable(!enable))
                                    }}
                                />
                            </span>
                        </Item>
                    </Form>
                </ScrollView>
                <ButtonGroup>
                    <Button
                        onClick={()=>{
                            history.goBack()
                        }}
                    >
                        <Icon type="cancel" size='15'/>取消
                    </Button>
                    <Button
                        onClick={()=>{
                            if(name===''){
                                Toast.info("名称不能为空",1)
                            }else if(name.length>6){
                                Toast.info("名称长度不能超过6位",1)
                            }else if(!denominatorValue && enable){
                                Toast.info("运算项分母不能为空",1)
                            }else if(denominatorName===''){
                                Toast.info("单位不能为空",1)
                            }else if(Number(denominatorName) >= 10000000){
                                Toast.info("运算项分母不可超过1000万",1)
                            }else if(denominatorValue===0){
                                Toast.info("运算项分母不能为0",1)
                            }else{
                                if(!isChange){
                                    dispatch(extraInformationActions.setNewExtraMessage(history))
                                }else{
                                    dispatch(extraInformationActions.updateExtraMessage(history))
                                }
                            }

                        }}
                    >
                        <Icon type="save" size='15' />保存
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
