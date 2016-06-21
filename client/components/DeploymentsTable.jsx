import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Error, Table, TableAction, TableCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from './Dashboard';

export default class DeploymentsTable extends Component {
  static propTypes = {
    showLogs: React.PropTypes.func.isRequired,
    error: React.PropTypes.string,
    records: React.PropTypes.array.isRequired
  };

  render() {
    const { error, records } = this.props;
    if (!error && records.size === 0) {
      return <div>There are no deployments available. Trigger a change in your repository to start a deployment.</div>;
    }

    return (
      <div>
        <Error message={error} />
        <Table>
          <TableHeader>
            <TableColumn width="3%" />
            <TableColumn width="20%">Date</TableColumn>
            <TableColumn width="35%">Repository</TableColumn>
            <TableColumn width="15%">Branch</TableColumn>
            <TableColumn width="20%">User</TableColumn>
            <TableColumn width="10%">Status</TableColumn>
            <TableColumn width="10%" />
          </TableHeader>
          <TableBody>
            {records.map((record, index) => {
              const success = !record.error;
              const color = success ? 'green' : '#A93F3F';
              const status = success ? 'Success' : 'Failed';
              return (
                <TableRow key={index}>
                  <TableIconCell color={color} icon="446" />
                  <TableTextCell>{record.date_relative}</TableTextCell>
                  <TableTextCell>{record.repository}</TableTextCell>
                  <TableTextCell>{record.branch}</TableTextCell>
                  <TableTextCell>{record.user}</TableTextCell>
                  <TableTextCell>{status}</TableTextCell>
                  <TableCell>
                    <ButtonToolbar style={{ marginBottom: '0px' }}>
                      <TableAction
                        id={`view-${index}`} type="default" title="Show Logs" icon="489"
                        onClick={() => this.props.showLogs(record)}
                      />
                    </ButtonToolbar>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
