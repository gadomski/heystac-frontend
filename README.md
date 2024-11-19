# heystac

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/gadomski/heystac/ci.yaml?style=for-the-badge)](https://github.com/gadomski/heystac/actions/workflows/ci.yaml)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/gadomski/heystac/pages.yaml?style=for-the-badge&label=pages)](https://github.com/gadomski/heystac/actions/workflows/pages.yaml)

> [!WARNING]
> <https://gadom.ski/heystac> is a Proof-of-Concept and not intended to be used as a Real Website™ (yet). The backend **heystac** command-line utility _is_ fit-for-purpose.

A curated geospatial asset discovery experience™.
**heystac** lives on [Github Pages](https://github.com/gadomski/heystac/deployments/github-pages) and has no other infrastructure.

![The heystac home page](./img/home.png)

## Developing

Get [yarn](https://yarnpkg.com/) and [uv](https://docs.astral.sh/uv/getting-started/installation/).
Then:

```shell
scripts/setup
```

To start the development server:

```shell
scripts/start
```

To run all tests:

```shell
scripts/test
```

To run all linters and format checkers:

```shell
scripts/lint
```

## License

MIT
