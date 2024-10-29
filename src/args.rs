use crate::Config;
use anyhow::Result;
use clap::Parser;

#[derive(Debug, Parser)]
pub struct Args {
    #[arg(short, long, default_value = "config.toml")]
    config_path: String,

    #[command(subcommand)]
    subcommand: Subcommand,
}

#[derive(Debug, clap::Subcommand)]
enum Subcommand {
    /// Crawl a catalog
    Crawl {
        /// The id or the href of the STAC catalog to crawl
        ///
        /// If the string "all" is provided, all configured catalogs will be crawled.
        id_or_href: String,

        /// The output file.
        ///
        /// Required if an href is provided, otherwise will be `crawl/<id>.json`.
        outfile: Option<String>,
    },

    /// Run the prebuild actions
    Prebuild,
}

impl Args {
    pub async fn run(self) -> Result<()> {
        let config = Config::from_path(&self.config_path)?;
        match self.subcommand {
            Subcommand::Crawl {
                id_or_href,
                outfile,
            } => config.crawl(id_or_href, outfile).await,
            Subcommand::Prebuild => config.prebuild(),
        }
    }
}

#[cfg(test)]
mod tests {
    use clap::Parser;

    use super::Args;

    #[tokio::test]
    async fn prebuild() {
        let args = Args::parse_from(["heystac", "prebuild"]);
        args.run().await.unwrap();
    }
}
