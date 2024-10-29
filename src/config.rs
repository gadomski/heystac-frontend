use crate::Crawl;
use anyhow::{anyhow, Error, Result};
use reqwest::Url;
use serde::Deserialize;
use stac::{Catalog, Link};
use std::{
    collections::HashMap,
    fs::File,
    io::{BufReader, Read},
    path::Path,
};

#[derive(Clone, Debug, Deserialize)]
pub struct Config {
    catalog: Catalog,
    pub catalogs: HashMap<String, CatalogConfig>,
}

#[derive(Clone, Debug, Deserialize)]
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

    pub async fn crawl_url(self, url: Url) -> Result<Crawl> {
        let catalog: Catalog = reqwest::get(url).await?.error_for_status()?.json().await?;
        crate::crawl(catalog).await
    }

    pub async fn crawl_id(self, id: &str) -> Result<Crawl> {
        let catalog_config = self
            .catalogs
            .get(id)
            .ok_or_else(|| anyhow!("invalid id: {id}"))?;
        let url = catalog_config.href.parse()?;
        self.crawl_url(url).await
    }

    pub fn into_catalog(mut self) -> Result<Catalog> {
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
        Ok(self.catalog)
    }
}
