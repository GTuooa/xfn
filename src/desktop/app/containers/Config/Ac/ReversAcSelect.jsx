import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'

import { Tabs, Modal } from 'antd'
import Trees from './Trees.jsx'
const TabPane = Tabs.TabPane

@immutableRenderDecorator
export default
class ReversAcSelect extends React.Component {

	render() {

        const { dispatch, reverseAcselectModalshow, acListTree, acListKeysArr, disabled, onSelect } = this.props

        return (
            <Modal
                title="科目选择"
                visible={reverseAcselectModalshow}
                onOk={() => {}}
                onCancel={() => {
					dispatch(configActions.switchReverseAcSelectModaShow())
				}}
                >
                <div className="revers-ac-select-wrap" onDoubleClick={() => {}}>
                    <Tabs defauActiveKey="资产" style={{marginTop: '-16px'}}>
                        {acListKeysArr.map((key, i) => {
                            return(
                                <TabPane tab={key} key={key}>
                                    <div>
                                        <Trees
                                            Data={acListTree.get(key)}
											disabled={disabled}
                                            selectedKeys={[]}
                                            onSelect={(info) => {
												onSelect(info[0])
											}}
                                        />
                                    </div>
                                </TabPane>
                            )
                        })}
                    </Tabs>
                </div>
            </Modal>
        )
    }
}
