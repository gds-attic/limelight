# Limelight

## What is it

Limelight is the app serving the 'new' frontend of the performance platform. (The GOV.UK dashboard is still served from
https://github.com/alphagov/datainsight-frontend). It gets data from the backdrop api (https://github.com/alphagov/backdrop) and 
converts it into dashboards and visualisations using backbone and d3.js.

## Starting Limelight serving it's own (stub) data

Files are served from the `backdrop_stub_controller` which is only routed in dev and test environment. New fixtures can be added in the controller.

```Shell
BACKDROP_URL=/backdrop_stub bowl limelight
```

## Starting Limelight with stub data

To run limelight using stubbed data instead of the backend, set the environment variable `USE_STUB_API` to `true` when you run the application.

Using `bowler`:

```Shell
USE_STUB_API=true bowl limelight
```

Using `rails`:

```Shell
USE_STUB_API=true rails s
```

If you use the latter you will need to set up [slimmer](https://github.com/alphagov/slimmer) yourself.
