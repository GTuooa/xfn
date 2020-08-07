import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as inventoryConfActions from 'app/redux/Config/Inventory/inventory.action.js'

import {Input,Radio ,Modal,Select,message} from 'antd'
const { Option } = Select;
@immutableRenderDecorator
export default
class AdjustAllCardlistModal extends React.Component {
    constructor(props){
        super(props)
        this.state={
            value:"add",
            addTypeList:[],
            removeTypeList:[]
        }
    }
    render(){
        const {showModal,closeModal,cardSelectList,originTags,dispatch} =this.props
        const {value,addTypeList,removeTypeList} =this.state
        let index = originTags.findIndex((data,index)=>{
            return data.get('name')==="全部"
        })
        let relativeTags=[]
        if(index > -1){
            relativeTags=originTags.delete(index)
        }
        const radioStyle = {
         display: 'block',
         height: '40px',
         lineHeight: '40px',
       };

        return(
            <Modal
                visible={showModal}
                onCancel={() => closeModal()}
                title="调整"
                onOk={()=>{
                    let cardUuidList =[]
                    let cardSelectedList = cardSelectList.toJS()
                    for (let i in cardSelectedList){
                        cardUuidList.push(cardSelectedList[i].uuid)
                    }
                    let beInsert = value==="add"?true:false
                    let categoryUuidList = value==="add"? addTypeList:removeTypeList
                    if(categoryUuidList.length===0){
                        message.info("请选择所属分类")
                    }else{
                        let object ={
                            cardUuidList,
                            categoryUuidList,
                            beInsert,
                        }
                        dispatch(inventoryConfActions.adjustInventoryCardList(object,closeModal))
                        this.setState({addTypeList:[],removeTypeList:[]})
                    }
                }}
            >
            <div style={{display:"flex",flexWrap:"wrap"}}>
            <Radio.Group
                style={{width:"120px"}}
                onChange={e=>{
                    this.setState({value:e.target.value})
                }}
                value={value}
            >
               <Radio style={radioStyle}  value={"add"}>
                加入所属分类：
               </Radio>
               <Radio style={radioStyle}  value={"remove"}>
               移出所属分类：
               </Radio>
             </Radio.Group>
             <div>
                <div style={{ width:"350px",height:"40px",display: "flex",alignItems: "center"}}>
                    <Select
                         mode="multiple"
                         style={{display:`${value === "add"?"block":"none"}`,width:"100%"}}
                         placeholder="批量修改卡片的所属分类"
                         value={addTypeList}
                         onChange={(value)=>{
                             this.setState({addTypeList:value,removeTypeList:[]})
                         }}
                     >
                         {relativeTags.map((data,item)=>{
                             return(
                                 <Option key={item} value={data.get('uuid')}>{data.get('name')}</Option>
                             )
                         })}
                    </Select>
                </div>
                <div style={{ width:"350px",height:"40px",display: "flex",alignItems: "center"}}>
                    <Select
                       mode="multiple"
                        style={{ display:`${value === "remove"?"block":"none"}`, width:"100%"}}
                       placeholder="批量修改卡片的所属分类"
                       value={removeTypeList}
                       onChange={(value)=>{
                           this.setState({removeTypeList:value,addTypeList:[]})
                       }}
                   >
                   {relativeTags.map((data,item)=>{
                       return(
                           <Option key={item} value={data.get('uuid')}>{data.get('name')}</Option>
                       )
                   })}
                    </Select>
                </div>
             </div>
            </div>
            </Modal>
        )
    }
}
