"use strict"

import {optional} from "../../utils/lang"

export class ActionButton extends React.Component {
    perform() {
        this.props.action.action()
    }

    componentDidMount() {
        $(this.refs.button).tooltip({trigger: "hover"})
    }

    render() {
        return (
            <li><a ref="button" href="javascript:;" data-toggle="tooltip" data-placement="bottom" title={this.props.action.tooltip} onClick={this.perform.bind(this)}><i className={this.props.action.icon}></i></a></li>
        )
    }
}

export class Actions extends React.Component {
    render() {
        let actionKey = 1

        return (
            !_.isEmpty(this.props.actions) &&
                <ul className="actions">
                    {this.props.actions.map(a => <ActionButton key={actionKey++} action={a} />)}
                </ul>

        )
    }
}

export class HeaderBlock extends React.Component {
    render() {
        return (
            <div className="block-header">
                {(!_.isEmpty(this.props.title) || !_.isEmpty(this.props.actions)) &&
                    <h2>
                        {this.props.title}
                        {!_.isEmpty(this.props.subtitle) &&
                            <small>{this.props.subtitle}</small>
                        }
                    </h2>
                }

                <Actions actions={this.props.actions} />
            </div>
        )
    }
}

export class Card extends React.Component {
    render() {
        let actionKey = 1
        let cardClass = optional(this.props.className, "card")
        let bodyClass = "card-body"
        if (this.props.padding) {
            bodyClass += " card-padding"
        }
        return (
            <div className={cardClass}>
                {!_.isEmpty(this.props.title) || !_.isEmpty(this.props.actions) ?
                    <div className="card-header">
                        <h2>
                            {this.props.title}
                            {!_.isEmpty(this.props.subtitle) ?
                                <small>{this.props.subtitle}</small>
                                : null }
                        </h2>

                        <Actions actions={this.props.actions} />
                    </div>
                    : null }
                <div className={bodyClass}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export class FloatingButton extends React.Component {
    onClick() {
        if (_.isFunction(this.props.onClick)) {
            this.props.onClick()
        }
    }

    render() {
        return (
            <button className="btn btn-float btn-danger m-btn waves-effect waves-circle waves-float" onClick={this.onClick.bind(this)}><i className={this.props.icon}></i></button>
        )
    }
}


export class ActionsMatcher {
    constructor(defaultActions) {
        this.defaultActions = defaultActions
    }

    match(userActions) {
        let actions = []

        if (userActions) {
            if (!_.isArray(userActions)) {
                throw new Error("grid.actions must be an array but is " + userActions)
            }

            _.each(userActions, a => {
                if (_.isObject(a)) {
                    actions.push(a)
                } else if (typeof a === "string") {
                    let defaultAction = _.find(this.defaultActions, d => d.id === a)
                    if (!_.isEmpty(defaultAction)) {
                        actions.push(defaultAction)
                    } else {
                        logger.w("Default action not found: " + a)
                    }
                }
            })
        } else {
            actions = this.defaultActions
        }

        return actions;
    }
}