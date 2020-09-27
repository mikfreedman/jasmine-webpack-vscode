# Jasmine, Webpack and Visual Studio Code
Run *and debug* [Jasmine](https://jasmine.github.io/2.0/introduction) tests executed using the [Karma](https://karma-runner.github.io/latest/index.html) test runner, right from [VS Code](https://code.visualstudio.com/)!

# Installation 

1. Install VSCode (`brew cask install visual-studio-code`)
1. Install [Angular/Karma Test Explorer for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=raagh.angular-karma-test-explorer)
1. `npm install`
1. Use the "Test Explorer" in VS Code to run / debug tests

# Command Line
## Test
```bash
$> npm run test
```
## Build
```bash
$> npm run build
```

# How it works

The *Angular/Karma Test Explorer* expects you to setup karma to execute chrome to listen for debugger connections on port `9222`. Here's what the extensions default `launch.json` looks like:

## Attaching the debugger

```json
    "angularKarmaTestExplorer.debuggerConfiguration": {
        "name": "Debug tests",
        "type": "chrome",
        "request": "attach",
        "port": 9222,
        "sourceMaps": true,
        "webRoot": "${workspaceRoot}",
        "sourceMapPathOverrides": {
            "webpack:/*": "${webRoot}/*",
            "/./*": "${webRoot}/*",
            "/src/*": "${webRoot}/*",
            "/*": "*",
            "/./~/*": "${webRoot}/node_modules/*"
        }
    }
````
So we need to setup our [karma.config.js](karma.conf.js) to allow for this connection:

```diff
-      browsers: ['ChromeHeadless'/*,'PhantomJS','Firefox','Edge','ChromeCanary','Opera','IE','Safari'*/],
+      browsers: ['ChromeHeadlessDebugging'/*,'PhantomJS','Firefox','Edge','ChromeCanary','Opera','IE','Safari'*/],
+      customLaunchers: {
+        ChromeHeadlessDebugging: {
+          base: 'ChromeHeadless',
+          flags: [
+            '--remote-debugging-port=9222'
+          ]
+        }
+      },
```

Confirm this works by looking at the extension logs and seeing something like this:

```
[3:24:25 PM] INFO: Listening to AngularReporter events on port 9222
[3:24:33 PM] INFO: Test loading completed
```

## Mapping Source
Get webpack to emit inline source maps in [karma.conf.js](karma.conf.js). Also ask it nicely to not minimize the generated code so that variable names match.

```diff
       webpack: {
+        devtool: "inline-source-map",
+        optimization: {
+          minimize: false
+        },
```

## Kill stray stuff

Keep an eye out for errant Chrome instances that gum up the works and generally foster weird behavior.

 `ps -ef | grep 9222 | cut -f 5 -d ' ' | xargs kill`

 [Check out what this does](https://explainshell.com/explain?cmd=ps+-ef+%7C+grep+9222+%7C+cut+-f+5+-d+%27+%27++%7C+xargs+kill)

 