import { getInput, setFailed, setOutput } from '@actions/core';
import { readFile, getVersionFromFile } from './csproj';
import { ensureVersionNotEmpty, validateVersion } from './validation';

function getInputs() {
  const file = getInput('file');
  const validate = getInput('validate');

  const validateLowerCase = validate.toLowerCase();

  if (validateLowerCase !== 'true' && validateLowerCase !== 'false') {
    throw new Error('Input validate must be true or false');
  }

  return {
    file,
    validate: validateLowerCase === 'true'
  };
}

try {
  const { file, validate } = getInputs();

  const fileContent = readFile(file);
  const version = getVersionFromFile(fileContent);

  validate
    ? validateVersion(version)
    : ensureVersionNotEmpty(version);

  setOutput('version', version);
} catch (error) {
  setFailed(error.message);
}