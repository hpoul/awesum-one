import 'request-promise-native'
import {logger} from './logging';
import {AwesomeItem, GithubRepository, GithubRepositoryInfoData, MarkdownHeadline} from './lib/shared/AwesomeListInfo';
import * as path from 'path';
import requestPromise = require('request-promise-native');
import base64 = require('base-64');
import crypto = require('crypto');
import fsExtra = require('fs-extra');

const cacheDirectory = path.join(__dirname, '../cache/');


class AwesomeList {
    items: AwesomeItem[] = [];

    constructor(public readonly repository: GithubRepository) {
    }
}

interface StupidCacheItem {
    updatedAt: number,
    value: any,
}

class StupidCache {
    constructor() {
        fsExtra.mkdirsSync(cacheDirectory);
    }

    async put(key: string, value: any) {
        if (!value) {
            throw new Error('Wanting to store null value!');
        }
        return await fsExtra.writeJson(
            path.join(cacheDirectory, hash(key)),
            <StupidCacheItem> { updatedAt: new Date().getTime(), value: value });
    }

    async get(key: string) {
        const keyHash = hash(key);
        try {
            let item: StupidCacheItem = await fsExtra.readJson(path.join(cacheDirectory, keyHash));
            return item.value;
        } catch (err) {
            if (err instanceof Error && (<any>err).code === 'ENOENT') {
                return null;
            }
            throw err;
        }
    }
}

/**
 * Turns a set of values into a HEX hash code.
 * @param value: The set of values to hash.
 * @return {String} or undefined.
 */
export const hash = (value: string) => {
    //const resultHash = crypto.createHash('md5');
    const resultHash = crypto.createHash('sha1');
    resultHash.update(value);
    return resultHash.digest('hex');
};


const defaultHeaders = {
    'User-Agent': 'hpoul',
    'Authorization': process.env.GITHUB_AUTH_TOKEN && `token ${process.env.GITHUB_AUTH_TOKEN}`,
};
const defaultArgs = {
    'headers': defaultHeaders,
    json: true,
};

export class AwesomeLoader {

    private cache = new StupidCache();

    private async loadReadme(repository: GithubRepository) {
        logger.debug(`loading readme from ${repository.readmeUrl}.`);
        const response = await requestPromise(repository.readmeUrl, defaultArgs);
        logger.debug('response: ', typeof response, response.name);
        return base64.decode(response.content);
    }

    private async loadRepositoryInfo(repository: GithubRepository) : Promise<GithubRepositoryInfoData> {
        const cached = await this.cache.get(repository.path);
        if (cached) return cached;
        logger.debug(`Loading infos for ${repository.path}.`);
        const ret = await requestPromise(repository.infoUrl, defaultArgs);
        this.cache.put(repository.path, ret).then(() => {});
        return ret;
    }

    async loadAwesomeMetaList(metaList: GithubRepository) {
        const content = this.loadReadme(metaList);
        logger.info('response: ', content);
    }

    private findHeadlines(markdown: string): MarkdownHeadline[] {
        const regex = /^(#+)\s*(.*)$/gm;
        let match;
        const ret: MarkdownHeadline[] = [];
        let lastLevel = 1;
        let parent: MarkdownHeadline|null = null;
        while (match = regex.exec(markdown)) {
            const [, levelString, title] = match;
            const level = levelString.length;

            const cleanTitle = title.replace(/\[.*?\]\(.*?\)/g, '');
            if (!cleanTitle) {
                continue;
            }

            if (lastLevel === level) {
                if (parent) {
                    parent = parent.parent;
                }
            } else if (lastLevel < level && ret.length > 0) {
                parent = ret[ret.length-1];
                while (parent && level <= parent.level) {
                    parent = parent.parent;
                }
            }
            ret.push({ parent: parent, level: level, position: regex.lastIndex, text: cleanTitle });
        }
        return ret;
    }

    private findClosestHeadline(headlines: MarkdownHeadline[], position: number) {
        for (let i = 0 ; i < headlines.length ; i++) {
            if (headlines[i].position > position) {
                if (i === 0) {
                    return null;
                }
                return headlines[i-1];
            }
        }
        return null;
    }

    async loadAwesomeList(awesomeList: GithubRepository) {
        const readme = await this.loadReadme(awesomeList);

        const headlines = this.findHeadlines(readme);

        // Simply find all links to other github projects.
        const regex = /\[(.*?)\]\((https?:\/\/github.com.*?)\)/g;
        let match: RegExpExecArray|null;
        const list = new AwesomeList(awesomeList);
        while (match = regex.exec(readme)) {
            const [, title, url] = match;
            const headline = this.findClosestHeadline(headlines, regex.lastIndex);

            const item = new AwesomeItem(GithubRepository.fromUrl(url), title, headline);
            item.infoData = await this.loadRepositoryInfo(item.repository);
            list.items.push(item);
        }

        return list;
    }
}
