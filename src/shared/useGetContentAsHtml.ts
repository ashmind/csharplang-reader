import { REPO } from './repo';
import { useOctokit } from './useOctokit';

export const useGetContentAsHtml = (path: string | null) => useOctokit(['content', path ?? ''], async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const response = await fetch(`https://api.github.com/repos/${REPO.owner}/${REPO.repo}/contents/${encodeURIComponent(path!)}`, {
    headers: {
      'Accept': 'application/vnd.github.v3.html'
    }
  });
  if (response.status !== 200)
    throw new Error('Unexpected response: ' + response.status + ' ' + response.statusText);

  return await response.text();
}, { enabled: !!path });