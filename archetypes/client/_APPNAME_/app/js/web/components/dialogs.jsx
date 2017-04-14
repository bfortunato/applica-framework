import {optional, parseBoolean} from "../../utils/lang"
"use strict"

export const DIALOG_RESULT_OK = 0
export const DIALOG_RESULT_CANCEL = 1

export class Dialog extends React.Component {

    constructor(props) {
        super(props)

        this.opened = false
        this.dialogResult = DIALOG_RESULT_CANCEL
    }

    componentDidMount() {
        let me = ReactDOM.findDOMNode(this)
        $(me)
            .modal({show: false})
            .on("show.bs.modal", () => this.opened = true)
            .on("hide.bs.modal", () => {
                this.opened = false
                if (_.isFunction(this.props.onClose)) {
                    this.props.onClose(this.dialogResult)
                }
            })

        if (!this.props.hidden) {
            if (!this.opened) {
                this.opened = true
                this.show()
            }
        } else {
            if (this.opened) {
                this.opened = false
                this.hide()
            }
        }
    }

    componentDidUpdate() {
        if (!this.props.hidden) {
            if (!this.opened) {
                this.opened = true
                this.show()
            }
        } else {
            if (this.opened) {
                this.opened = false
                this.hide()
            }
        }
    }

    show() {
        let me = ReactDOM.findDOMNode(this)
        $(me).modal("show")
    }

    hide() {
        let me = ReactDOM.findDOMNode(this)
        $(me).modal("hide")
    }

    runButtonAction(button) {
        this.dialogResult = optional(button.dialogResult, DIALOG_RESULT_CANCEL)
        button.action(this)
    }

    render() {
        let buttons = optional(this.props.buttons, []).map(b => <button key={b.text} type="button" className="btn btn-link waves-effect" onClick={this.runButtonAction.bind(this, b)}>{b.text}</button>)
        let style = {
            //display: this.props.hidden ? "none" : "block"
        }

        let bodyStyle = {
            padding: this.props.noPadding ? "0px" : undefined
        }

        let modalDialogClassName = "modal-dialog"
        modalDialogClassName += parseBoolean(this.props.large) ? " modal-lg" : ""

        return (
            <div className="modal fade" role="dialog" tabIndex="-1" style={style}>
                <div className={modalDialogClassName}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body" style={bodyStyle}>
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            {buttons}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}