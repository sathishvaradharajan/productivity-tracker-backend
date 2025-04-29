import { Injectable} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {
  async getRecentCommits(accessToken: string): Promise<any> {
    const reposRes = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const repos = reposRes.data;

    const commitData = await Promise.all(
      repos.slice(0, 3).map(async (repo: any) => {
        const commitsRes = await axios.get(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          }
        );

        return {
          repo: repo.name,
          commits: commitsRes.data.slice(0, 5), // latest 5 commits
        };
      })
    );

    return commitData;
  }
}
