export const resolveRepoId = async (owner: string, repo: string) => {
  const resp = await fetch(`https://api.ossinsight.io/gh/repo/${owner}/${repo}`);
  if (resp.ok) {
    const id = (await resp.json()).data.id;
    return parseInt(id);
  } else {
    console.error(await resp.text());
    throw new Error(resp.statusText);
  }
};

export const resolveUserId = async (owner: string) => {
  const resp = await fetch(`https://api.ossinsight.io/q/get-user-by-login?login=${owner}`);
  if (resp.ok) {
    const id = (await resp.json()).data[0]?.id;
    if (typeof id === 'number' && isFinite(id)) {
      return id;
    } else {
      throw new Error(`User '${owner}' not found`)
    }
  } else {
    console.error(await resp.text());
    throw new Error(resp.statusText);
  }
};

export const ossinsightQuery = async (query: string, params: Record<string, any>) => {
  const url = new URL(`https://api.ossinsight.io/q/${query}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const resp = await fetch(url);
  if (resp.ok) {
    return await resp.json();
  } else {
    console.error(await resp.text())
    throw new Error(resp.statusText);
  }
};
