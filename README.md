# Serverless SQL Setup 

## Table of Contents

-   [Title](#serverless-sql-setup)
-   [Description](#description)
-   [Setup](#setup)
-   [Usage](#usage)
-   [Contributing](#contributing)
-   [Credits](#credits)

## Description

A tool using GCP VPC to grant access to CloudSQL.

## Setup

### Clone the project

> We recommend that you clone using SSH, if you need a refresher on how got to the [Github guide here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

#### Install Dependencies

`yarn install`

#### Start up the tool 

`node cloudSetup.js`

You will then be taken through the following questions: 
> Make sure you have a note on your exact project name and region from your GCP project. 

- `Project?`
- `Region?`          
- `vpcName?`
- `Connector Name?`
- `Sql Instance?`
- `Functions`
- `IP Range?` (note the defaul is 10.8.0.0/28)
- `Commands only?`

After inputting the values to these questions, the tool will run commands to setup your vcp connector.s

## Contributing

Note that the development workflow is as follows:

Rules on updating branches:

-   `main` branch (only after `release` branch has successfully completed CI GitHub actions.)
-   `qa` branch - tested staging prior to release.
-   `release` branch - For `develop` branch that has completed code review.
-   `develop` branch - after `feature` or `fix` branch has completed code review and is able to merge.
-   `feature` branch for features and any non-bug additions.
-   `fix` for bug-fixes and/or style/UI refactors. Can also be used for code refactor after code reviews and/or automated code inspection (i.e. CodeQL)

## Credits

FYC Labs