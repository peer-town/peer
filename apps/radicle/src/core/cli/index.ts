import shell from "shelljs";
import {config} from "../../config";

export const initRadRepoDirectory = () => {
  shell.echo("Creating repo directory at", config.rad.repoDir);
  const result = exec(`mkdir -p ${config.rad.repoDir}`);
  if (result.code !== 0) {
    throw new Error(result.stderr);
  }
  return result;
}

export const exec = (command: string) => {
  shell.echo(`executing ${command}`);
  const result = shell.exec(command);
  if (result.code !== 0) {
    throw new Error(result.stderr);
  }
  return result;
}

export const cd = (dir: string) => {
  return shell.cd(dir);
}
