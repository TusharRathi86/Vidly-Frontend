import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (items, columns) => {
    if (columns.content) return columns.content(items);

    return _.get(items, columns.path);
  };

  createKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  render() {
    const { data, columns } = this.props;
    return (
      <tbody>
        {data.map((rowItem) => (
          <tr key={rowItem._id}>
            {columns.map((rowData) => (
              <td key={this.createKey(rowItem, rowData)}>
                {this.renderCell(rowItem, rowData)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
