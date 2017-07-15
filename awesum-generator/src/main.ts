import {AwesomeLoader} from "./AwesomeLoader";
import {logger} from "./logging";
import * as jsyaml from "js-yaml";
import winston = require('winston');
import fsExtra = require('fs-extra');
import * as path from "path";
import {AwesomeIndexData, AwesomeListStoredData, AwesumConfig, GithubRepository} from './lib/shared/AwesomeListInfo';

const awesomeLists = [
    GithubRepository.fromUrl('https://github.com/dzharii/awesome-typescript'),
    GithubRepository.fromUrl('https://github.com/JStumpp/awesome-android'),
];

const outputDirectory = path.join(__dirname, '../out/');

winston.cli();


function main() {
    const loader = new AwesomeLoader();
    (async () => {
        try {
            logger.debug('Starting loading.');
            let stored = await Promise.all(awesomeLists.map(async awesomeList => {
                const list = await loader.loadAwesomeList(awesomeList);
                logger.info('Got list: ', list);

                await fsExtra.mkdirs(outputDirectory);
                await fsExtra.writeFile(path.join(outputDirectory, awesomeList.saveFileName), jsyaml.safeDump(list));

                logger.info(`written into ${outputDirectory}`);
                return <AwesomeListStoredData> {
                    title: '',
                    saveFile: awesomeList.saveFileName,
                    repository: awesomeList
                };
            }));
            let index: AwesomeIndexData = { stored: stored };
            await fsExtra.writeFile(path.join(outputDirectory, AwesumConfig.awesumIndexFileName), jsyaml.safeDump(index));
        } catch (error) {
            logger.error("Error while loading awesome list.", error);
        }
    })().then(() => {
        logger.info('all done.');
    });
}

main();

