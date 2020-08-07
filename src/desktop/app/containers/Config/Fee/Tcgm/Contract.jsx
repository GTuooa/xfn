import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Modal } from 'antd'

@immutableRenderDecorator
export default
class Contract extends React.Component {

    render() {
        const { dispatch, readContractStatus, cancelClick, onClick } = this.props;

        return (
            <Modal
                title="用户服务协议"
                visible={readContractStatus}
                onCancel={cancelClick}
                onOk={onClick}
                okText="同意"
            >
                <div className="contract">
                    <p className="contract-info">尊敬的用户：</p>
                    <p className="contract-info">以下简称“您”或“用户”，请您充分阅读下列服务条款，并点击同意后方可接受小番财务微应用提供给您的服务。</p>
                    <div className="contract-info">
                        <span>服务提供：</span>
                        <span>杭州小番网络科技有限公司（以下简称“小番科技”）依本服务条款提供发布于钉钉应用市场内的小番财务微应用中的财务工具和服务。</span>
                    </div>
                    <div className="contract-info">
                        <span>停止使用：</span>
                        <span>如用户不同意本服务条款及相关修订内容应立即停止使用小番财务微应用。</span>
                    </div>
                    <div className="contract-info">
                        <span>修订生效：</span>
                        <span>用户对小番财务微应用和相关服务的继续使用视为其同意接受经修订的服务条款。</span>
                    </div>
                    <div className="contract-info">
                        <span>用户注册：</span>
                        <span>用户进入本微应用时，默认使用的是进入钉钉的同一账户，用户在小番科技旗下产品注册的其他账号与本账号无同一性。</span>
                    </div>
                    <div className="contract-info">
                        <span>应用部署：</span>
                        <span>用户部署应用，根据钉钉应用规则，应用与用户所在钉钉的组织相关联，同一用户在不同组织下使用小番财务无同一性。</span>
                    </div>
                    <div className="contract-info">
                        <span>应用付费：</span>
                        <span>钉钉注册组织的管理用户购买应用付费版本，该付费版本与付费时所在钉钉组织相关联，不能跨组织使用。</span>
                    </div>
                    <div className="contract-info">
                        <span>信息授权：</span>
                        <span>用户一旦开始使用小番财务微应用，即视为同意并授权小番科技可以调取其在钉钉的用户基础资料及在小番财务微应用中产生的数据、文档等资料信息。小番科技尊重用户的隐私，承诺不会在无用户授权的情况下公开或透露用户信息。</span>
                    </div>
                    <div className="contract-info">
                        <span>责任承担：</span>
                        <span>
                            小番科技负责小番财务微应用的研发、迭代与维护。对下列情形，小番科技不承担任何责任：（1）并非由于小番科技的故意或过失而导致小番财务微应用未能注册成功；（2）非因小番科技原因导致客户遭受损失的；（3）如因小番科技无法控制的原因使系统崩溃，或无法正常使用导致小番财务微应用服务无法完成或丢失相关信息、纪录等；（4）小番科技保留为维护、更新系统而短暂停止服务的权利。
                        </span>
                    </div>
                    <div className="contract-info">
                        <span>消息通知：</span>
                        <span>可能通过邮件推送、短信发送、手机应用消息、应用内公告以及小番科技官网（www.xfannix.com）公告等方式向您通知。</span>
                    </div>
                    <div className="contract-info">
                        <span>内容限制：</span>
                        <span>
                            用户保证提交的内容不含有任何违反国家有关法律、法规及中华人民共和国承认或加入的国际条约的内容，包括但不限于危害国家安全、淫秽色情、虚假、侮辱、诽谤、恐吓或骚扰、侵犯他人知识产权或人身权或其他合法权益以及有违社会公序良俗的内容或指向这些内容的链接，小番科技一经发现有权编辑或移除。
                        </span>
                    </div>
                    <div className="contract-info">
                        <span>声明保证：</span>
                        <span>用户声明并保证其在小番科技微应用中发布的内容是合法、真实、准确、非误导性的。</span>
                    </div>
                    <div className="contract-info">
                        <span>知识产权：</span>
                        <span>小番财务微应用、其他小番科技相关产品的界面设计、发布原创文章之著作权及相关一切权利均归小番科技所有。</span>
                    </div>
                    <div className="contract-info">
                        <span>使用限制：</span>
                        <span>
                            用户只能基于其业务范围内使用小番财务微应用服务，禁止出售、转售或复制、开发使用权限，禁止基于商业目的模仿小番财务微应用的产品和服务；禁止复制和模仿小番财务微应用的设计理念、界面、功能和图表；未经小番科技书面许可，禁止对基于此项服务或内容进行修改或制造派生产品。用户违反本条款给小番科技造成的任何损失，用户应负责全额赔偿。
                        </span>
                    </div>
                    <div className="contract-info">
                        <span>免责声明：</span>
                        <span>
                            用户对其钉钉账户或在小番财务微应用内注册的用户名和密码的安全性付全部责任，并对以其用户名进行的所有活动和事件负全部责任，用户若发现任何非法使用小番财务微应用的管理账号或存在安全漏洞的情况，应立即通知小番科技。
                        </span>
                    </div>
                    <div className="contract-info">
                        <span>使用提示：</span>
                        <span>小番财务微应用作为一款财务工具，其设计和算法逻辑基于用户可操作性和流畅性建立。使用小番财务微应用需具备一定的财务知识，小番科技不对用户使用小番财务统计得出的报表合规性作任何承诺。如继续使用本产品即视为已接受本产品的设计或运算逻辑，所造成一切损失由用户自行负责。</span>
                    </div>
                    <div className="contract-info">
                        <span>赔偿责任：</span>
                        <span>若用户使用小番财务微应用从事任何违法或侵权行为，用户应自行承担全部责任。如果小番科技违反本服务条款规定的义务，给用户造成损失的，赔偿金的最高限额为用户向小番科技首次提出赔偿主张时最近一次购买小番财务微应用服务实际支付的服务费。</span>
                    </div>
                    <div className="contract-info">
                        <span>暂停终止：</span>
                        <span>若用户提供的信息不真实、违反本服务条款、侵害国家或任何第三方合法权益，或因系统维护升级等，小番科技均有可能暂停或终止服务且不承担责任。</span>
                    </div>
                    <div className="contract-info">
                        <span>准据法律：</span>
                        <span>本服务条款之效力、解释、执行均适用中华人民共和国法律。</span>
                    </div>
                    <div className="contract-info">
                        <span>争议解决：</span>
                        <span>本服务条款履行过程发生任何争议的，由双方协商解决，协商不成的，向杭州市余杭区人民法院起诉。</span>
                    </div>
                </div>
            </Modal>
        )
    }
}
