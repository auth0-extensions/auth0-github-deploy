# Auth0 GitHub Deployments

## Move Notice

Beginning with the `2.6` release of this extension, we have moved from separate repositories for each of the deployment extensions (github, gitlab, bitbucket, and visualstudio) to building and deploying via a single `auth0-deploy-extensions` monorepo. This approach will make maintainence and issue tracking across all four extensions much easier for Auth0 and more timely for our customers.

The new monorepo can be found here: [auth0-deploy-extensions](https://github.com/auth0-extensions/auth0-deploy-extensions)

## Warning

Since v2.4, this extension is using new version of `auth0-source-control-extension-tools`, which is incompatible with node 4. The extension will work on node 8 runtime only. Please, read this [Migration Guide](https://auth0.com/docs/migrations/guides/extensibility-node8) for more information.
