import { execSync } from "child_process";
import path from "path";

export const resetIdentities = () => {
  deleteIdentity();
  createIdentity();
};

export const deleteIdentity = () => {
  execSync(
    'curl --silent -H "Content-Type: application/json" -X GET "http://localhost:4434/admin/identities" | jq -r ".[].id // empty" | xargs -r -I {} curl --silent -H "Accept: application/json" -X DELETE "http://localhost:4434/admin/identities/{}"',
  );
};

export const createIdentity = () => {
  const identityPath = path.resolve(
    __dirname,
    "../../docker/kratos/identity.json",
  );
  execSync(
    `curl --silent -H "Content-Type: application/json" -X POST "http://localhost:4434/admin/identities" -d @${identityPath}`,
  );
};
