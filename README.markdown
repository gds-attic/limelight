# Limelight

## What is it

Limelight is the app serving the 'new' frontend of the performance platform. (The GOV.UK dashboard is still served from
https://github.com/alphagov/datainsight-frontend). It gets data from the backdrop api (https://github.com/alphagov/backdrop) and 
converts it into dashboards and visualisations using backbone and d3.js.

## Starting Limelight with stub data

To run limelight using stubbed data instead of the backend, set the environment variable `USE_STUB_API` to `true` when you run the application and provide the BACKDROP_PORT unless you are running on port 80. To register stubs, add them to the backdrop controller.

Using `bowler`:

```Shell
USE_STUB_API=true BACKDROP_PORT=3040 bowl limelight
```

Using `rails`:

```Shell
USE_STUB_API=true BACKDROP_PORT=3000 rails s
```

If you use the latter you will need to set up [slimmer](https://github.com/alphagov/slimmer) yourself or specify STATIC_DEV.

## Tests

To run all tests:

`bundle exec rake test:all`

To run the feature tests:

* Passing tests: `bundle exec rake cucumber:ok`
* Work in progress: `bundle exec rake cucumber:wip`

To run Javascript tests:

* In the browser: `bundle exec rake jasmine`
* In CI: `bundle exec rake jasmine:phantomjs:ci`
* With code coverage: `bundle exec rake jasmine:blanketjs`

To run Javascript style checks:

`bundle exec rake jshint`

**Cucumber tests through Selenium:**

[Download Selenium Server](http://docs.seleniumhq.org/download/) (2.33.0
seems to work nicely). Run it on the host (physical or vm) with the browser under test with:

```shell
java -jar selenium-server-standalone-2.33.0.jar
```

Run the tests:
- `BROWSER_NAME`: eg. firefox, ie, chrome, safari
- `DRIVER_HOST`: The IP address of the host running the selenium server.
- `APP_HOST`: The host name where the app server is already running.
- `APP_HOST_IP`: The IP address where the app server will be run.

Use *either* `APP_HOST` or `APP_HOST_IP`.

    APP_HOST_IP=10.0.0.1 BROWSER_NAME=firefox DRIVER_HOST=10.0.2.2 bundle exec cucumber -p selenium


**Cucumber tests through Sauce:**

[Register with Saucelabs](https://saucelabs.com) and download their [Sauce Connect](https://saucelabs.com/docs/connect) tool. Run it locally with

```shell
java -jar Sauce-Connect.jar <sauce-user> <sauce-key>
```

Run the tests:

```shell
bundle exec rake sauce:cucumber SAUCE_ACCESS_KEY=<sauce-user> SAUCE_USERNAME=<sauce-key> APP_HOST='http://127.0.0.1:49221' RUN_SERVER=true
```
