import React,{ Fragment } from 'react'
import { Row, Icon, ChosenPicker, Single, DatePicker } from 'app/components'
import CommonRow from './CommonRow'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'
import * as thirdParty from 'app/thirdParty'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'

function chooseComplexPicker(choice,list,callback) {
	let appId = ''
	if (ROOTURL.indexOf('mtst.xfannix.com') > -1) {
		appId = Limit.APPID_TEST // '1390'
	} else if (ROOTURL.indexOf('mpre.xfannix.com') > -1) {
		appId = Limit.APPID_PREF // '3837'
	} else if (ROOTURL.indexOf('mobile.xfannix.com') > -1) {
		appId = Limit.APPID_FORM // '1948'
	}

	thirdParty.complexPicker({
		title: '选择联系人',            //标题
		corpId: sessionStorage.getItem('corpId'),   //企业的corpId
		multiple: choice,         //是否多选
		limitTips: "超出了",     //超过限定人数返回提示
		maxUsers: 1000,        //最大可选人数
		pickedUsers: list,    //已选用户
		pickedDepartments: [],          //已选部门
		disabledUsers: [],              //不可选用户
		disabledDepartments: [],        //不可选部门
		requiredUsers: [],              //必选用户（不可取消选中状态）
		requiredDepartments: [],        //必选部门（不可取消选中状态）
		appId: appId,                   //微应用的Id
		permissionType: "xxx",          //选人权限，目前只有GLOBAL这个参数
		responseUserOnly: true,        //ture表示返回人，false返回人和部门
		startWithDepartmentId: 0 ,   // 0表示从企业最上层开始，IOS不支持该字段
		onSuccess: (resultlist) => {
            if (resultlist.users.length) {
                callback(resultlist.users)
            }
		},
		onFail: (err) => {
			console.log(JSON.stringify(err))
		}
	})
}

export default
class ContactsComp extends React.Component {

    render() {
        const {
            disabled,
            dispatch,
            item,
            cardList,
            index,
            onChange,
            placeArr
        } = this.props
		const value = item.get('value') || []
        return (
            <CommonRow
				type={'multiple'}
                value={item.get('name')}
                label={item.get('label')}
                placeHolder={item.get('placeHolder')}
				StarDisabled={!item.get('required')}
                onClick={()=> {
                    chooseComplexPicker(item.get('choice'),value,resultlist => {
                        const name = resultlist.map(v => v.name)
                        const emplId = resultlist.map(v => v.emplId)
                        dispatch(editApprovalActions.changeModelString([...placeArr,'value'],emplId))
                        dispatch(editApprovalActions.changeModelString([...placeArr,'name'],name))

                    })
                }}
                onDelete={() => {
                    dispatch(editApprovalActions.changeModelString([...placeArr,'value'],[]))
                    dispatch(editApprovalActions.changeModelString([...placeArr,'name'],[]))
                }}
            />
        )
    }
}
