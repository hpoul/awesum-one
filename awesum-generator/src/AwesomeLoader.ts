import 'request-promise-native'
import {logger} from "./logging";
import requestPromise = require("request-promise-native");
import base64 = require('base-64');
import {AwesomeItem, GithubRepository, MarkdownHeadline} from "./lib/shared/AwesomeListInfo";

class AwesomeList {
    items: AwesomeItem[] = [];

    constructor(public readonly repository: GithubRepository) {
    }
}


export class AwesomeLoader {


    private async loadReadme(repository: GithubRepository) {
        logger.debug(`loading readme from ${repository.readmeUrl}.`);
        const response = await requestPromise(repository.readmeUrl, {headers: {'User-Agent': 'hpoul'}, json: true});
        logger.debug('response: ', typeof response, response.name);
        return base64.decode(response.content);
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
            list.items.push(new AwesomeItem(GithubRepository.fromUrl(url), title, headline));
        }
        return list;
    }
}
