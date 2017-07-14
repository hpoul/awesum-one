

import {AwesomeLoader} from "./AwesomeLoader";
import {GithubRepository} from "./GithubData";

const awesomeAwesome = GithubRepository.fromPath('sindresorhus/awesome');

function hello(compiler: string) {
    const loader = new AwesomeLoader();
    (async () => {
        loader.loadAwesomeMetaList(awesomeAwesome);
    })().then(() => {
        console.log('all done.');
    });
    console.log(`Hello from ${compiler}`);
}
hello("TypeScript");

