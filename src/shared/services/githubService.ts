export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    topics: string[];
    language: string | null;
    stargazers_count: number;
    updated_at: string;
}

export const githubService = {
    async fetchUserRepos(username: string): Promise<GitHubRepo[]> {
        if (!username) return [];

        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
            if (!response.ok) {
                if (response.status === 404) return [];
                throw new Error('Failed to fetch repositories');
            }

            const data = await response.json();
            return data.map((repo: any) => ({
                id: repo.id,
                name: repo.name,
                description: repo.description,
                html_url: repo.html_url,
                homepage: repo.homepage,
                topics: repo.topics || [],
                language: repo.language,
                stargazers_count: repo.stargazers_count,
                updated_at: repo.updated_at
            }));
        } catch (error) {
            console.error("GitHub Fetch Error:", error);
            throw error;
        }
    }
};
