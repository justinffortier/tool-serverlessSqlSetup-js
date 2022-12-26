const inquirer = require('inquirer');
const { exec } = require('child_process');

const setQuestions = () => {
  return [
    {
      name: 'project',
      type: 'text',
      message: 'Project?',
    },
    {
      name: 'region',
      type: 'text',
      message: 'Region?',
      default: 'us-central1',
    },
    {
      name: 'vpcName',
      type: 'text',
      message: 'vpcName?',
      default: 'cloud-functions-egress',
    },
    {
      name: 'connectorName',
      type: 'text',
      message: 'Connector Name?',
      default: 'cloud-functions-connector',
    },
    {
      name: 'instance',
      type: 'text',
      message: 'Sql Instance?',
    },
    {
      name: 'functions',
      type: 'text',
      message: 'Functions (comma separated)?',
    },
    {
      name: 'ipRange',
      type: 'text',
      message: 'IP Range?',
      default: '10.8.0.0/24',
    },
    {
      name: 'commandsOnly',
      type: 'confirm',
      message: 'Commands only?',
    },
  ];
};

const enableServiceApis = responses => {
  try {
    const command = `gcloud services enable servicenetworking.googleapis.com --project=${}`;
    if (responses.commandsOnly) {
      return command;
    }
    const { stdout, stderr } = exec(command);

    if (stderr) {
      throw stderr;
    }

    return stdout;
  } catch (error) {
    throw error;
  }
};

const createVPC = responses => {
  try {
    const command = `gcloud compute networks create ${responses.vpcName} --project=${responses.project} --subnet-mode=auto --mtu=1460 --bgp-routing-mode=regional`;
    if (responses.commandsOnly) {
      return command;
    }
    const { stdout, stderr } = exec(command);

    if (stderr) {
      throw stderr;
    }

    return stdout;
  } catch (error) {
    throw error;
  }
};

const createVPCConnector = responses => {
  try {
    const command = `gcloud compute networks vpc-access connectors create ${responses.connectorName} --region ${responses.region} --network ${responses.vpcName} --range ${responses.ipRange} --project ${responses.project}`;
    if (responses.commandsOnly) {
      return command;
    }
    const { stdout, stderr } = exec(command);

    if (stderr) {
      throw stderr;
    }

    return stdout;
  } catch (error) {
    throw error;
  }
};

const updateSqlInstance = responses => {
  try {
    const command = `gcloud beta sql instances patch ${responses.instance} --project=${responses.project} --network=projects/${responses.project}/global/networks/${responses.vpcName} --assign-ip`;
    if (responses.commandsOnly) {
      return command;
    }
    const { stdout, stderr } = exec(command);

    if (stderr) {
      throw stderr;
    }

    return stdout;
  } catch (error) {
    throw error;
  }
};

const updateCloudFunctions = responses => {
  try {
    const commands = responses.functions.split(',').map(functionName => {
      return `gcloud functions deploy ${functionName.trim()} --vpc-connector ${
        responses.connectorName
      } --project ${responses.project}`;
    });

    const command = commands.join(' && ');
    if (responses.commandsOnly) {
      return command;
    }
    const { stdout, stderr } = exec(command);

    if (stderr) {
      throw stderr;
    }

    return stdout;
  } catch (error) {
    throw error;
  }
};

const init = async () => {
  try {
    const questions = setQuestions();
    const responses = await inquirer.prompt(questions);

    const enableServiceApisResult = enableServiceApis(responses);
    const createVPCResult = createVPC(responses);
    const createVPCConnectorResult = createVPCConnector(responses);
    const updateSqlInstanceResult = updateSqlInstance(responses);
    const updateCloudFunctionsResult = updateCloudFunctions(responses);

    const result = {
      enableServiceApisResult,
      createVPCResult,
      createVPCConnectorResult,
      updateSqlInstanceResult,
      updateCloudFunctionsResult,
    };
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

init();
