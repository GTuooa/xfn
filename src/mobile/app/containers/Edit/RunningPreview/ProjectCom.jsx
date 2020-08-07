import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Row, Amount } from 'app/components'


@immutableRenderDecorator
export default
class ProjectCom extends React.Component {

	render() {

        const { projectCardList } = this.props

        if (projectCardList && projectCardList.size) {
            return (
                <div>
                    {
                        projectCardList.map((v,i) => {
                            let showName = `${v.get('code')} ${v.get('name')}`
							if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(v.get('code'))) {
								showName = v.get('name')
							}
                            return (
                                <div key={i} className='running-preview-item'>
                                    <div className='running-preview-item-title'>项目：</div>
                                    <div className='running-preview-item-content overElli'>
                                        {showName}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        } else {
            return null
        }
    }
}
