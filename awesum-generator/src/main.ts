import {AwesomeLoader} from "./AwesomeLoader";
import {GithubRepository} from "./GithubData";
import {logger} from "./logging";
import * as jsyaml from "js-yaml";
import winston = require('winston');
import fsExtra = require('fs-extra');
import * as path from "path";

const awesomeAwesome = GithubRepository.fromPath('sindresorhus/awesome');
const awesomeAndroid = GithubRepository.fromUrl('https://github.com/JStumpp/awesome-android');

const outputDirectory = path.join(__dirname, '../out/');

winston.cli();


function main() {
    const loader = new AwesomeLoader();
    (async () => {
        try {
            logger.debug('Starting loading.');
            const list = await loader.loadAwesomeList(awesomeAndroid);
            logger.info('Got list: ', list);

            await fsExtra.mkdirs(outputDirectory);
            await fsExtra.writeFile(path.join(outputDirectory, 'awesum.yaml'), jsyaml.safeDump(list));

            logger.info(`written into ${outputDirectory}`);
        } catch (error) {
            logger.error("Error while loading awesome list.", error);
        }
    })().then(() => {
        logger.info('all done.');
    });
}

main();

