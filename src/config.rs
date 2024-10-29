use crate::Crawl;
use anyhow::{anyhow, Error, Result};
use reqwest::Url;
use serde::Deserialize;
use stac::{Catalog, Link};
use std::{
    collections::HashMap,
    fs::File,
    io::{BufReader, Read, Write},
    path::{Path, PathBuf},
};

#[derive(Clone, Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Config {
    catalog: Catalog,
    #[serde(rename = "crawl-directory")]
    crawl_directory: PathBuf,
    #[serde(rename = "catalog-path")]
    catalog_path: PathBuf,
    catalogs: HashMap<String, CatalogConfig>,
}

#[derive(Clone, Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CatalogConfig {
    href: String,
    title: String,
    index: usize,
}

impl Config {
    pub fn from_path(path: impl AsRef<Path>) -> Result<Config> {
        let mut file = BufReader::new(File::open(path)?);
        let mut s = String::new();
        file.read_to_string(&mut s)?;
        toml::from_str(&s).map_err(Error::from)
    }

    pub fn prebuild(mut self) -> Result<()> {
        // Write the catalog into the app
        for (id, catalog_config) in &self.catalogs {
            let mut link =
                Link::child(&catalog_config.href).title(Some(catalog_config.title.clone()));
            // Once https://github.com/stac-utils/stac-rs/issues/501 lands this should be cleaner
            link.additional_fields
                .insert("heystac:id".into(), id.as_str().into());
            link.additional_fields
                .insert("heystac:index".into(), catalog_config.index.into());
            self.catalog.links.push(link);
        }
        self.catalog.links.sort_by_key(|c| {
            c.additional_fields
                .get("heystac:index")
                .unwrap()
                .as_i64()
                .unwrap()
        });
        let mut file = File::create(&self.catalog_path)?;
        serde_json::to_writer_pretty(&mut file, &self.catalog)?;
        file.write_all(b"\n").map_err(Error::from)
    }

    pub async fn crawl(self, id_or_href: String, outfile: Option<String>) -> Result<()> {
        if let Ok(url) = Url::parse(&id_or_href) {
            if let Some(outfile) = outfile {
                let crawl = self.crawl_url(url).await?;
                std::fs::write(outfile, serde_json::to_string_pretty(&crawl)?).map_err(Error::from)
            } else {
                eprint!("ERROR: outfile must be provided when crawling an href");
                std::process::exit(1);
            }
        } else if id_or_href == "all" {
            for id in self.catalogs.keys() {
                let config = self.clone();
                let crawl = config.crawl_id(id).await?;
                let outfile = self.crawl_directory.join(id).with_extension("json");
                std::fs::write(outfile, serde_json::to_string_pretty(&crawl)?)?;
            }
            Ok(())
        } else {
            let outfile = self
                .crawl_directory
                .join(&id_or_href)
                .with_extension("json");
            let crawl = self.crawl_id(&id_or_href).await?;
            std::fs::write(outfile, serde_json::to_string_pretty(&crawl)?).map_err(Error::from)
        }
    }

    async fn crawl_url(self, url: Url) -> Result<Crawl> {
        let catalog: Catalog = reqwest::get(url).await?.error_for_status()?.json().await?;
        crate::crawl(catalog).await
    }

    async fn crawl_id(self, id: &str) -> Result<Crawl> {
        let catalog_config = self
            .catalogs
            .get(id)
            .ok_or_else(|| anyhow!("invalid id: {id}"))?;
        let url = catalog_config.href.parse()?;
        self.crawl_url(url).await
    }
}
