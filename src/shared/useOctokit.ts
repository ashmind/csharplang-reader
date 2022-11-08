import { useQuery } from "@tanstack/react-query";
import { Octokit as OctokitCore } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { retry } from "@octokit/plugin-retry";
import type { ThrottlingOptions } from "@octokit/plugin-throttling/dist-types/types.d";
import { throttling } from "@octokit/plugin-throttling";

type OctokitRequestOptions = {
  method: string;
  url: string;
  request: { retryCount: number };
};
const Octokit = OctokitCore.plugin(
  restEndpointMethods,
  paginateRest,
  retry,
  throttling
).defaults({
  throttle: {
    onRateLimit: (retryAfter, options: OctokitRequestOptions, octokit) => {
      octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

      if (options.request.retryCount === 0) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds.`);
        return true;
      }
    },
    onAbuseLimit: (retryAfter, options: OctokitRequestOptions, octokit) => {
      octokit.log.warn(`Abuse detected for request ${options.method} ${options.url}`);

      if (options.request.retryCount === 0) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds.`);
        return true;
      }
    }
  } as ThrottlingOptions
});

const octokitInstance = new Octokit();
export const useOctokit = <TResult>(
  key: readonly string[],
  query: (octokit: typeof octokitInstance) => Promise<TResult>,
  { enabled = true }: { enabled?: boolean } = {}
) => {
  const { data, error, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => query(octokitInstance),
    staleTime: Infinity,
    enabled
  });

  return [data, error, isLoading] as const;
};