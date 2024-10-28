use anyhow::{Error, Result};
use serde::Deserialize;
use stac::{Catalog, Link};
use std::{
    collections::HashMap,
    fs::File,
    io::{BufReader, Read},
    path::Path,
};

const CATALOG_ID: &str = "heystac";
const CATALOG_DESCRIPTION: &str = "A curated geospatial asset discovery experience™";

#[derive(Debug, Deserialize)]
pub struct Config {
    catalogs: HashMap<String, CatalogConfig>,
}

#[derive(Debug, Deserialize)]
struct CatalogConfig {
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

    pub fn write_catalog(&self, path: impl AsRef<Path>) -> Result<()> {
        let mut catalog = Catalog::new(CATALOG_ID, CATALOG_DESCRIPTION);
        for (id, catalog_config) in &self.catalogs {
            let mut link =
                Link::child(&catalog_config.href).title(Some(catalog_config.title.clone()));
            link.additional_fields
                .insert("heystac:id".into(), id.as_str().into());
            link.additional_fields
                .insert("heystac:index".into(), catalog_config.index.into());
            catalog.links.push(link);
        }
        catalog.links.sort_by_key(|c| {
            c.additional_fields
                .get("heystac:index")
                .unwrap()
                .as_i64()
                .unwrap()
        });
        let file = File::create(path)?;
        serde_json::to_writer_pretty(file, &catalog).map_err(Error::from)
    }
}
