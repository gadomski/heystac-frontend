# heystac

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/gadomski/heystac/ci.yaml?style=for-the-badge)](https://github.com/gadomski/heystac/actions/workflows/ci.yaml)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/gadomski/heystac/pages.yaml?style=for-the-badge&label=pages)](https://github.com/gadomski/heystac/actions/workflows/pages.yaml)

> [!WARNING]
> This is a work in progress, _and_ @gadomski is 🗑️ at front-end dev, so set your expectations low.

A curated geospatial asset discovery experience™.
**heystac** lives on [Github Pages](https://github.com/gadomski/heystac/deployments/github-pages) and has no other infrastructure.

![The heystac home page](./img/home.png)

## Developing

Get [yarn](https://yarnpkg.com/).
Then:

```shell
yarn install
yarn dev
```

### Frontend

The frontend is built in [next.js](https://nextjs.org/), using [tailwind css](https://tailwindcss.com/) and [Development Seed's UI components](https://ui.ds.io).
The frontend code lives in [app](./app/).

### Backend

We have a command-line interface (CLI), also called **heystac**, for generating pre-rendered content.
The Python code for the CLI lives in [src](./src/).
The CLI builds our STAC catalog, which lives in a submodule at [heystac-catalog](https://github.com/gadomski/heystac-catalog).

If you want to build the catalog from scratch:

```shell
heystac bootstrap
heystac crawl --all
heystac rate
```

However, most of the time you'll just be (re)crawling catalogs and then rating them:

```shell
heystac crawl my-new-catalog
heystac rate
```

## License

MIT
