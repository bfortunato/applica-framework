"use strict"

export class GridHeaderCell extends React.Component {
    render() {
        return (
            <th>{this.props.column.header}</th>
        )
    }
}

export class GridHeader extends React.Component {
    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let headerCells = this.props.descriptor.columns.map(c => <GridHeaderCell column={c} />)

        return (
            <thead>
            <tr>{headerCells}</tr>
            </thead>
        )
    }
}

export class GridBody extends React.Component {
    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let rows = this.props.descriptor.columns.map(c => <TextCell value={c.header} />)

        return (
            <tbody>
            <tr>{rows}</tr>
            </tbody>
        )
    }
}

export class Grid extends React.Component {
    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        return (
            <table className="table table-striped table-condensed table-hover">
                <GridHeader descriptor={this.props.descriptor} />
                <GridBody descriptor={this.props.descriptor} />
            </table>
        )
    }
}

export class Cell extends React.Component {

}

export class TextCell extends Cell {
    render() {
        return (
            <td>{this.props.value}</td>
        )
    }
}

export class CheckCell extends Cell {
    render() {
        return (
            null
        )
    }
}