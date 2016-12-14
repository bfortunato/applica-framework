"use strict"

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

export class HeaderBlock extends React.Component {
    render() {
        let actionKey = 1

        return (
            <div className="block-header">
                {!_.isEmpty(this.props.title) || !_.isEmpty(this.props.actions) ?
                    <h2>
                        {this.props.title}
                        {!_.isEmpty(this.props.subtitle) ?
                            <small>{this.props.subtitle}</small>
                            : null }
                    </h2>
                : null }

                {!_.isEmpty(this.props.actions) ?
                    <ul className="actions">
                        {this.props.actions.map(a => <ActionButton key={actionKey++} action={a} />)}
                    </ul>
                    : null }
            </div>
        )
    }
}

export class Card extends React.Component {
    render() {
        let actionKey = 1
        let className = "card"
        if (this.props.padding) {
            className += " card-padding"
        }
        return (
            <div className={className}>
                {!_.isEmpty(this.props.title) || !_.isEmpty(this.props.actions) ?
                    <div className="card-header">
                        <h2>
                            {this.props.title}
                            {!_.isEmpty(this.props.subtitle) ?
                                <small>{this.props.subtitle}</small>
                                : null }
                        </h2>

                        {!_.isEmpty(this.props.actions) ?
                            <ul className="actions">
                                {this.props.actions.map(a => <ActionButton key={actionKey++} action={a} />)}
                            </ul>
                        : null }
                    </div>
                    : null }

                {this.props.children}
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