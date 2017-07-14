import {AwesomeLoader} from "./AwesomeLoader";
import {GithubRepository} from "./GithubData";
import winston = require('winston');
import {logger} from "./logging";
import * as jsyaml from "js-yaml";

const awesomeAwesome = GithubRepository.fromPath('sindresorhus/awesome');
const awesomeAndroid = GithubRepository.fromUrl('https://github.com/JStumpp/awesome-android');

winston.cli();

function main() {
    const loader = new AwesomeLoader();
    (async () => {
        try {
            logger.debug('Starting loading.');
            const list = await loader.loadAwesomeList(awesomeAndroid);
            logger.info('Got list: ', list);
            logger.debug('as yaml: ' + jsyaml.safeDump(list));
        } catch (error) {
            logger.error("Error while loading awesome list.", error);
        }
    })().then(() => {
        logger.info('all done.');
    });
}

main();

