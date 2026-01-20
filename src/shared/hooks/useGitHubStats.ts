import { useState, useEffect } from 'react';

interface Repo {
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    html_url: string;
}

interface GitHubStats {
    repos: number;
    followers: number;
    following: number;
    avatar: string;
    name: string;
    topRepos: Repo[];
    loading: boolean;
    error: string | null;
}

export const useGitHubStats = (username: string) => {
    const [stats, setStats] = useState<GitHubStats>({
        repos: 0,
        followers: 0,
        following: 0,
        avatar: '',
        name: '',
        topRepos: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        if (!username || username === "#" || username.includes("github.com")) return;

        Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`)
        ])
            .then(async ([userRes, repoRes]) => {
                if (!userRes.ok) throw new Error('Failed to fetch GitHub data');
                const userData = await userRes.json();
                const repoData = repoRes.ok ? await repoRes.json() : [];

                setStats({
                    repos: userData.public_repos,
                    followers: userData.followers,
                    following: userData.following,
                    avatar: userData.avatar_url,
                    name: userData.name,
                    topRepos: Array.isArray(repoData) ? repoData : [],
                    loading: false,
                    error: null
                });
            })
            .catch(err => {
                setStats(prev => ({ ...prev, loading: false, error: err.message }));
            });
    }, [username]);

    return stats;
};
