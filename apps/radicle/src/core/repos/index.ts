import {Request, Response} from "express";
import {extractProjectName} from "../../utils/data";
import {cd, exec} from "../cli";
import {config} from "../../config";
import {Resp} from "../../utils/response";

export const publish = (req: Request, res: Response) => {
  const {username, repoUrl, description, branch} = req.body;
  const repoName = extractProjectName(repoUrl);
  const fullQualifiedName = `${username}/${repoName}`;
  try {
    const radId = hostRepo(repoUrl, fullQualifiedName, branch, description);
    return Resp.okD(res, {radId}, "Repo hosted on radicle");
  } catch (e: any) {
    return Resp.error(res, e.message);
  }
}

const hostRepo = (url: string, repoName: string, branch: string, description: string) => {
  cd(config.rad.repoDir);
  exec("mkdir -p temp");
  cd("temp");
  exec(`git clone ${url} ${repoName}`);
  cd(repoName);
  exec("ls -l");
  exec(`rad init . --name ${repoName} --description "${description}" --default-branch ${branch}`);
  const radId = exec("rad .").stdout;
  exec("git push rad && rad sync");
  cd("../../");
  exec("rm -rf temp");
  exec(`rad rm --no-confirm ${radId}`);
  return radId.trim();
}
