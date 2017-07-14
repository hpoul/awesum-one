
import 'request-promise-native'
import requestPromise = require("request-promise-native");
import {GithubRepository} from "./GithubData";
import base64 = require('base-64');

export class AwesomeLoader {


    async loadAwesomeMetaList(metaList: GithubRepository) {
        const response = await requestPromise(metaList.readmeUrl, {headers: {'User-Agent': 'hpoul'}, json: true});
        console.log('response: ', typeof response, response.name);
        const content = base64.decode(response.content);
        console.log('response: ', response.content, content);
    }
}
