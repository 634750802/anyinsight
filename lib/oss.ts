export const resolveRepoId = async (owner: string, repo: string) => {
  console.log('resolving repoId for %s/%s', owner, repo);
  const resp = await fetch(`https://api.ossinsight.io/gh/repo/${owner}/${repo}`);
  if (resp.ok) {
    const id = (await resp.json()).data.id;
    console.log('resolved %d', id);
    return parseInt(id);
  } else {
    console.log(await resp.text());
    throw new Error(resp.statusText);
  }
};
