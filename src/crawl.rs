use anyhow::{Error, Result};
use reqwest::{Client, Url};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use stac::Catalog;
use std::{collections::HashMap, future::Future, pin::Pin};
use tokio::task::JoinSet;

#[derive(Debug, Serialize, Deserialize)]
pub struct Crawl {
    children: Vec<Value>,

    item: Option<Value>,

    #[serde(flatten)]
    additional_fields: HashMap<String, Value>,
}

pub async fn crawl(catalog: Catalog) -> Result<Crawl> {
    let client = Client::new();
    crawl_value(catalog.try_into()?, client).await?.try_into()
}

fn crawl_value(
    mut value: CrawlValue,
    client: Client,
) -> Pin<Box<impl Future<Output = Result<CrawlValue>>>> {
    Box::pin(async move {
        let mut join_set: JoinSet<Result<CrawlValue>> = JoinSet::new();
        match value.r#type.as_str() {
            "Catalog" => {
                for link in value.links.iter().filter(|link| link.rel == "child") {
                    let href = link.href.clone();
                    let client = client.clone();
                    tracing::info!("getting child: {href}");
                    let _ = join_set.spawn(async move {
                        client
                            .get(href)
                            .send()
                            .await?
                            .error_for_status()?
                            .json()
                            .await
                            .map_err(Error::from)
                    });
                }
            }
            "Collection" => {
                if let Some(link) = value.links.iter().find(|link| link.rel == "item") {
                    tracing::info!("getting item: {}", link.href);
                    value.item = client
                        .get(&link.href)
                        .send()
                        .await?
                        .error_for_status()?
                        .json()
                        .await?;
                }
                if value.item.is_none() {
                    if let Some(link) = value.links.iter().find(|link| link.rel == "items") {
                        let url = Url::parse_with_params(
                            &link.href,
                            [("limit", "1"), ("sortby", "-properties.datetime")],
                        )?;
                        tracing::info!("getting items: {}", url);
                        let mut items: CrawlValue =
                            reqwest::get(url).await?.error_for_status()?.json().await?;
                        if !items.features.is_empty() {
                            value.item = Some(Box::new(items.features.remove(0)));
                        }
                    }
                }
            }
            _ => {}
        }
        while let Some(result) = join_set.join_next().await {
            let child = result??;
            let client = client.clone();
            let child = crawl_value(child, client).await?;
            value.children.push(child);
        }
        Ok(value)
    })
}

// We use a very limited STAC value representation to parse as permissively as possible.
#[derive(Debug, Deserialize, Serialize)]
struct CrawlValue {
    r#type: String,
    #[serde(default)]
    links: Vec<CrawlLink>,
    #[serde(default)]
    children: Vec<CrawlValue>,
    #[serde(default)]
    item: Option<Box<CrawlValue>>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    features: Vec<CrawlValue>,
    #[serde(flatten)]
    additional_fields: HashMap<String, Value>,
}

#[derive(Debug, Deserialize, Serialize)]
struct CrawlLink {
    href: String,
    rel: String,
    #[serde(flatten)]
    additional_fields: HashMap<String, Value>,
}

impl TryFrom<Catalog> for CrawlValue {
    type Error = Error;

    fn try_from(value: Catalog) -> Result<Self> {
        serde_json::from_value(serde_json::to_value(value)?).map_err(Error::from)
    }
}

impl TryFrom<CrawlValue> for Crawl {
    type Error = Error;

    fn try_from(value: CrawlValue) -> Result<Self> {
        serde_json::from_value(serde_json::to_value(value)?).map_err(Error::from)
    }
}
