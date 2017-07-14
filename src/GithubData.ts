
import { URL } from 'url';

export namespace GithubConfig {
    export const ApiUrl = 'https://api.github.com';

}

export class GithubRepository {

    // constructor(
    //     readonly owner: string,
    //     readonly name: string
    // ) {
    //
    // }

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

    get path(): string { return `${this.owner}/${this.name}`; }

    get readmeUrl(): string {
        return `${GithubConfig.ApiUrl}/repos/${this.path}/readme`
    }

}
