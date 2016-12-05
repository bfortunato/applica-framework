"use strict"

export class Grid extends React.Component {
    componentDidMount() {
        this.props.children.forEach(c => console.log(c))
    }

    render() {
        return (
            <table className="table table-striped table-condensed table-hover">
                <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Nickname</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>Alexandra</td>
                    <td>Christopher</td>
                    <td>@makinton</td>
                    <td>Ducky</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Madeleine</td>
                    <td>Hollaway</td>
                    <td>@hollway</td>
                    <td>Cheese</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Sebastian</td>
                    <td>Johnston</td>
                    <td>@sebastian</td>
                    <td>Jaycee</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Mitchell</td>
                    <td>Christin</td>
                    <td>@mitchell4u</td>
                    <td>AdskiDeAnus</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>Elizabeth</td>
                    <td>Belkitt</td>
                    <td>@belkitt</td>
                    <td>Goat</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>Benjamin</td>
                    <td>Parnell</td>
                    <td>@wayne234</td>
                    <td>Pokie</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>Katherine</td>
                    <td>Buckland</td>
                    <td>@anitabelle</td>
                    <td>Wokie</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>Nicholas</td>
                    <td>Walmart</td>
                    <td>@mwalmart</td>
                    <td>Spike</td>
                </tr>
                </tbody>
            </table>
        )
    }
}

export class Column extends React.Component {

}

export class TextColumn extends Column {
    render() {
        return (
            null
        )
    }
}

export class CheckColumn extends Column {
    render() {
        return (
            null
        )
    }
}