"use strict"

export class ListItem extends React.Component {
    constructor(props) {
        super(props)
    }

    onClick() {
        if (_.isFunction(this.props.onClick)) {
            this.props.onClick(this.props.item)
        }
    }

    render() {
        let view = React.createElement(this.props.view, {item: this.props.item})
        return (
            <div className="list-group-item hover pointer-cursor" onClick={this.onClick.bind(this)}>
                {view}
            </div>
        )
    }
}

export class List extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let view = this.props.view
        let data = this.props.data
        let onItemClick = this.props.onItemClick
        let items = data.map(i => <ListItem key={i.id} view={view} item={i} onClick={onItemClick} />)
        return (
            <div className="list-group lg-odd-black">
                {items}
            </div>
        )
    }
}