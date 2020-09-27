import {HelloWorld} from "../src/index"
 
describe("HelloWorld", function () {
    it("says hello world", function () {
        let helloWorld = new HelloWorld();
        expect(helloWorld.say()).toEqual("Hello World!")
    });
});