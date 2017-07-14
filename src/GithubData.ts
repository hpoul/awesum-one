
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

    constructor(
        readonly owner: string,
        readonly name: string
    ) {

    }

    static fromPath(path: string) {
        const [owner, name] = path.split('/');
        return new GithubRepository(owner, name);
    }

    get path(): string { return `${this.owner}/${this.name}`; }

    get readmeUrl(): string {
        return `${GithubConfig.ApiUrl}/repos/${this.path}/readme`
    }

}
