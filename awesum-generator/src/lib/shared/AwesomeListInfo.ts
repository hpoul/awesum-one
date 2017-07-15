
import { URL } from 'url';

export namespace GithubConfig {
    export const ApiUrl = 'https://api.github.com';
}

export namespace AwesumConfig {
    export const awesumIndexFileName = 'awesum-index.yaml';
}

export interface GithubRepositoryData {
    owner: string;
    name: string;
}

export class GithubRepository implements GithubRepositoryData {

    private static readonly urlMatcher = new RegExp('https?://github.com/([^/]+)/([^/]+)');

    constructor(
        readonly owner: string,
        readonly name: string
    ) {

    }

    static fromPath(path: string) {
        const [owner, name] = path.replace(/^\/+/, '').split('/');
        return new GithubRepository(owner, name);
    }

    static fromUrl(url: string) {
        return GithubRepository.fromPath(new URL(url).pathname);
    }

    get githubMainUrl() { return `https://github.com/${this.path}`}

    get path(): string { return `${this.owner}/${this.name}`; }

    get infoUrl(): string {
        return `${GithubConfig.ApiUrl}/repos/${this.path}`;
    }

    get readmeUrl(): string {
        return `${GithubConfig.ApiUrl}/repos/${this.path}/readme`;
    }

    get saveFileName(): string {
        return `${this.owner}__${this.name}.yaml`;
    }

}

export interface GithubRepositoryInfoData {
    id: number,

    subscribers_count: number,
    watchers_count: number,
    stargazers_count: number,

    created_at: string,
    updated_at: string,
    pushed_at: string,

    homagepage: string|null,
    description: string,
}

export interface AwesomeIndexData {
    stored: AwesomeListStoredData[]
}

export interface AwesomeListStoredData {
    title: string;
    repository: GithubRepositoryData;
    saveFile: string;
}

export class AwesomeItem {
    infoData: GithubRepositoryInfoData;

    constructor(
        public readonly repository: GithubRepository,
        public title: string,
        public category: MarkdownHeadline|null,
    ) {

    }
}

export interface MarkdownHeadline {
    parent: MarkdownHeadline|null,
    text: string;
    level: number;
    position: number;
}

export class AwesomeCategory implements MarkdownHeadline {
    parent: MarkdownHeadline | null;
    text: string;
    level: number;
    position: number;

    fullPath: string;

    constructor(headline: MarkdownHeadline) {
        Object.assign(this, headline);

        this.fullPath = this.createFullPath();
    }

    private createFullPath(): string {
        let headline: MarkdownHeadline|null = this;
        let title = '';
        while (headline) {
            title = headline.text + (title && ' / ' + title);
            headline = headline.parent;
        }
        return title;
    }
}
