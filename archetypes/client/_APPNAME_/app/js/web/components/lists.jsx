import _ from "underscore";
import React from "react";

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
        let view = React.createElement(this.props.view, {item: this.props.item, list: this.props.list})
        return (
            <div className="listview__item pointer-cursor" onClick={this.onClick.bind(this)}>
                {view}
            </div>
        )
    }
}

export class List extends React.Component {
    constructor(props) {
        super(props)
    }

    invokeAction(action, data) {
        if (_.isFunction(this.props.onAction)) {
            this.props.onAction(action, data)
        }
    }

    getKey(item) {
        if (_.isFunction(this.props.keygen)) {
            return this.props.keygen(item)
        } else {
            return item.id
        }
    }

    render() {
        let view = this.props.view
        let data = this.props.data
        let onItemClick = this.props.onItemClick
        let items = data.map(i => <ListItem key={this.getKey(i)} view={view} item={i} list={this} onClick={onItemClick} />)
        return (
            <div className="listview listview--hover">
                {items}
            </div>
        )
    }
}