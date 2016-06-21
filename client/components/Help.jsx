import React, { Component } from 'react';

export default class Help extends Component {
  render() {
    return (
      <div>
        <h5>Usage</h5>
        <p>
          Rules and Database Connection scripts can be deployed from a GitHub repository to an Auth0 account by using the following convention.
          For rules you can create one or more Javascript files in a rules directory.
          The filename will be the actual name of the rule.
          In addition to that a JSON file can be added to the repository which will be used to configure additional settings like <strong>order</strong>, <strong>stage</strong> and <strong>status</strong> (enabled/disabled).
        </p>
        <code className="hljs">
          /rules/link-users.js<br />
          /rules/link-users.json<br />
          /rules/verify-email.js<br />
          /rules/verify-email.json<br />
        </code>
        <p>
          For database connections you'll create a directory for each database connection, where the directory must match the connection name.
          After that you'll create a file for every script you want to support in the connection.
          Supported scripts: <strong>get_user</strong>, <strong>create</strong>, <strong>verify</strong>, <strong>login</strong>, <strong>change_password</strong>, <strong>delete</strong>
        </p>
        <code className="hljs">
          /database-connections/my-sql-db/login.js<br />
          /database-connections/my-sql-db/create.js
        </code>
      </div>
    );
  }
}
