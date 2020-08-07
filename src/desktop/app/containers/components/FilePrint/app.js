import React from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS }	from 'immutable'
import './style.less'
import * as Limit from 'app/constants/Limit.js'
import { ROOTURL } from 'app/constants/fetch.constant.js'

import { Modal, Button, Icon ,Radio,Checkbox, Input, message } from 'antd'
import thirdParty from 'app/thirdParty'
import EnclosurePreview from 'app/containers/components/EnclosurePreview'
import { DateLib,judgePermission } from 'app/utils'
// import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as printActions from 'app/redux/Edit/FilePrint/filePrint.actions.js'
// function chooseLib(callback) {
//     if (global.isplayground)
//         return
//     let appId = ''
// 	if (ROOTURL.indexOf('mtst.xfannix.com') > -1) {
// 		appId = Limit.APPID_TEST // '1390'
// 	} else if (ROOTURL.indexOf('mpre.xfannix.com') > -1) {
// 		appId = Limit.APPID_PREF // '3837'
// 	} else if (ROOTURL.indexOf('mobile.xfannix.com') > -1) {
// 		appId = Limit.APPID_FORM // '1948'
// 	}
//     thirdParty.complexPicker({
//         // startWithDepartmentId: 0,
//         title: '选择审核人',            //标题
// 		corpId: sessionStorage.getItem('corpId'),   //企业的corpId
// 		multiple: true,         //是否多选
// 		limitTips: "超出了",     //超过限定人数返回提示
// 		maxUsers: 1000,        //最大可选人数
// 		pickedUsers: [],    //已选用户
// 		pickedDepartments: [],          //已选部门
// 		disabledUsers: [],              //不可选用户
// 		disabledDepartments: [],        //不可选部门
// 		requiredUsers: [],              //必选用户（不可取消选中状态）
// 		requiredDepartments: [],        //必选部门（不可取消选中状态）
// 		appId: appId,                   //微应用的Id
// 		permissionType: "xxx",          //选人权限，目前只有GLOBAL这个参数
// 		responseUserOnly: true,        //ture表示返回人，false返回人和部门
// 		startWithDepartmentId: 0 ,   // 0表示从企业最上层开始，IOS不支持该字段
// 		onSuccess: (resultlist) => {
// 			callback(resultlist)
// 		},
// 		onFail: (err) => {
// 			// alert(JSON.stringify(err))
// 		}
//     })
// }
function chooseLib(callback) {
	thirdParty.choose({
		// startWithDepartmentId: 0,
		multiple: false,
		users: [],
		max: 1500,
		onSuccess: (resultlist) => {
			callback(resultlist)
		},
		onFail: (err) => {
			// thirdParty.Alert('获取钉钉通讯录失败，请刷新后重试')
		}
	})
}
@connect(state => state)
export default
class FilePrint extends React.Component {
    constructor() {
		super()
		this.state = {
            needA4: 'A4',
            needCreatedby: '1',
            needReviewedBy:true,
            needAss: '1',
            reviewedBy:'',
			needPrintName:'1',
			needPrintEnclosure:'1'

		}
	}
	componentWillUnmount() {
		this.props.dispatch(printActions.setPrintString('fromPage','static'))
	}
    shouldComponentUpdate(nextprops, nextstate) {
		return this.props.filePrintState !== nextprops.filePrintState || this.props.allState !== nextprops.allState || this.props.homeState !== nextprops.homeState || this.state !== nextstate
	}

    render(){
        const { dispatch, filePrintState , allState, homeState}=this.props
        const sobInfo = homeState.getIn(['data', 'userInfo','sobInfo'])
        const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 : false
        const vcIndex = filePrintState.get('vcIndex')
        const year = filePrintState.get('year')
		const month = filePrintState.get('month')
		const fromPage = filePrintState.get('fromPage')
        const oriUuid = filePrintState.get('oriUuid')
        const showPrintModal = allState.get('showPrintModal')
        const {needA4, needCreatedby, needAss, needReviewedBy, reviewedBy, needPrintName, needPrintEnclosure }=this.state
        let url = `https://www.xfannix.com/utils/img/icons/${fromPage === 'cxls'?'A4_jr':needA4.length>2?`${needA4.slice(0,2)}_${needA4.slice(2)}`:needA4}.png`

        const fromPos = sessionStorage.getItem('fromPos')
        //打印权限
        const PRINT = homeState.getIn(['data', 'userInfo','pageController','QUERY_VC','preDetailList','PRINT'])

        // console.log('fromPos', fromPos);
        // console.log('批量打印权限BATCH_PRINT_AND_EXPORT_PDF',PRINT.getIn(['detailList', 'BATCH_PRINT_AND_EXPORT_PDF','display']));
        // console.log('modal打印权限PRINT',PRINT.get('display'));

        let disabledPrint = false
        if (isRunning) {
            disabledPrint = false
        } else {
            disabledPrint = fromPos === 'modal' ?
                            judgePermission(PRINT).disabled
                            :
                            (fromPos == 'cxpz' ?
                                judgePermission(PRINT.getIn(['detailList', 'BATCH_PRINT_AND_EXPORT_PDF'])).disabled
                                :
                                (fromPos == 'lrpz' ? false : true)
                            )
                        
        }
        

        return(
            <Modal
                title='打印设置'
                visible={showPrintModal}
                className='filePrint'
                width={480}
                bodyStyle={{padding:'0px'}}
                footer={[
                    <Button
                        type="ghost"
                        onClick={()=>{
                            dispatch(allActions.handlePrintModalVisible(false))
                        }}
                    >
                        取消
                    </Button>,
                    <Button
                        type="primary"
                        //如果是modal弹窗打印走打印权限 如果是cxpz列表打印走查询凭证批量打印权限 如果是详细页打印走查询凭证打印权限
                        disabled={disabledPrint}
                        onClick={()=>{
							if (fromPage === 'cxls') {
								dispatch(printActions.jrPdfPrint(needPrintName,needPrintEnclosure,oriUuid))
							} else if (fromPage === 'static') {
								if (isRunning) {
									if (needReviewedBy && !reviewedBy) {
										message.info('审核人必填，仅可选择1人')
										return
									} else {
										dispatch(printActions.printPdf(year,month,vcIndex,needCreatedby,needA4,'',needReviewedBy,reviewedBy))
									}
								} else {
									dispatch(printActions.printPdf(year,month,vcIndex,needCreatedby,needA4,needAss))
								}
							}
                        }}
                    >确认</Button>
                ]}
                onCancel={()=>dispatch(allActions.handlePrintModalVisible(false))}
            >
                <div className='printPreviewBody'>
                    <div className='print-preview-img'>
                        <img src={url}/>
                    </div>
                    <div className="print-preview-btn-group">
                        <div style={{marginBottom:'12px'}}>
                            <span>打印纸型：</span>
                            <Radio.Group onChange={(e) => this.setState({needA4: e.target.value})} value={needA4}>
                                <Radio value={'A4'} style={{marginRight:'30px'}}>A4</Radio>
								{
									fromPage === 'static'?
									<Radio value={'A5'} style={{marginRight:'30px'}}>A5</Radio>:''
								}
								{
									fromPage === 'static'?
									<Radio value={'1224'} style={{marginRight:'30px'}}>12*24</Radio>:''
								}
								{
									fromPage === 'static'?
									<Radio value={'1424'} style={{marginRight:'30px'}}>14*24</Radio>:''
								}
                             </Radio.Group>
                        </div>
                        {
                            !isRunning && fromPage === 'static'?
                            <div style={{marginBottom:'12px'}}>
                                 <Checkbox checked={needCreatedby === "1"} onChange={() => needCreatedby === "1" ? this.setState({needCreatedby: '0'}) : this.setState({needCreatedby: '1'})}>
                                    打印“制单人”、“审核人”名称
                                 </Checkbox>
                            </div>:''
                        }
						{
                            fromPage === 'cxls'?
                            <div style={{marginBottom:'12px'}}>
                                 <Checkbox checked={needPrintName === "1"} onChange={() => needPrintName === "1" ? this.setState({needPrintName: '0'}) : this.setState({needPrintName: '1'})}>
                                    打印“制单人”、“审核人”名称
                                 </Checkbox>
                            </div>:''
                        }
						{
                            fromPage === 'cxls'?
                            <div style={{marginBottom:'12px'}}>
                                 <Checkbox checked={['1','2'].includes(needPrintEnclosure)} onChange={() => needPrintEnclosure === "0" ? this.setState({needPrintEnclosure: '1'}) : this.setState({needPrintEnclosure: '0'})}>
                                    打印流水附件
                                 </Checkbox>
                            </div>:''
                        }
						{
                            fromPage === 'cxls' && ['1','2'].includes(needPrintEnclosure)?
                            <div style={{marginBottom:'12px'}}>
							<Radio.Group onChange={(e) => this.setState({needPrintEnclosure: e.target.value})} value={needPrintEnclosure}>
								<Radio value={'1'}>
								   打印附件(仅图片格式及含“发票”标签的PDF文件首页)
							   </Radio>
							   <Radio value={'2'}>
								   仅打印附件清单
								</Radio>
							</Radio.Group>

                            </div>:''
                        }

                        {
                            isRunning && fromPage === 'static'?
                            <div style={{margin:'12px 0'}}>
                                 <Checkbox checked={needCreatedby === "1"} onChange={() => needCreatedby === "1" ? this.setState({needCreatedby: '0'}) : this.setState({needCreatedby: '1'})}>
                                    打印“制单人”名称
                                 </Checkbox>
                            </div>:''
                        }
                        {
                            isRunning && fromPage === 'static'?
                            <div style={{marginBottom:'12px',display:'flex',lineHeight:'28px'}}>
                                 <Checkbox checked={needReviewedBy} onChange={() => {
                                    this.setState({needReviewedBy: !needReviewedBy})

                                 }}>
                                    打印“审核人”名称
                                 </Checkbox>
                                 {
                                     needReviewedBy?
                                     <div
                                     className='print-name'
                                     style={{flex:1,border:'1px solid #ccc'}}
                                     onClick={() => {
                                         chooseLib((resultlist) => {
                                             if (resultlist.length) {
                                                 this.setState({reviewedBy: resultlist[0].name})
                                             }
                                             })
                                     }}
                                     >
                                         {reviewedBy}
                                     </div>:''
                                 }

                            </div>:''
                        }
                        {
                            !isRunning && fromPage === 'static'?
                            <div>
                                 <Checkbox checked={needAss === "1"} onChange={() => needAss === "1" ? this.setState({needAss: '0'}) : this.setState({needAss: '1'})}>
                                    打印辅助核算
                                 </Checkbox>
                            </div>:''
                        }
                    </div>

                </div>

            </Modal>
        )
    }
}
