use clap::Parser;
use heystac::Config;
use reqwest::Url;

#[derive(Debug, Parser)]
struct Args {
    #[command(subcommand)]
    subcommand: Subcommand,
}

#[derive(Debug, clap::Subcommand)]
enum Subcommand {
    /// Crawl all catalogs
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

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let args = Args::parse();
    let config = Config::from_path("config.toml").unwrap();
    match args.subcommand {
        Subcommand::Crawl {
            id_or_href,
            outfile,
        } => {
            if let Ok(url) = Url::parse(&id_or_href) {
                if let Some(outfile) = outfile {
                    let crawl = config.crawl_url(url).await.unwrap();
                    std::fs::write(outfile, serde_json::to_string_pretty(&crawl).unwrap()).unwrap()
                } else {
                    eprint!("ERROR: outfile must be provided when crawling an href");
                    std::process::exit(1);
                }
            } else if id_or_href == "all" {
                for id in config.catalogs.keys() {
                    let config = config.clone();
                    let crawl = config.crawl_id(id).await.unwrap();
                    let outfile = format!("crawl/{id}.json");
                    std::fs::write(outfile, serde_json::to_string_pretty(&crawl).unwrap()).unwrap();
                }
            } else {
                let crawl = config.crawl_id(&id_or_href).await.unwrap();
                let outfile = format!("crawl/{id_or_href}.json");
                std::fs::write(outfile, serde_json::to_string_pretty(&crawl).unwrap()).unwrap();
            }
        }
        Subcommand::Prebuild => {
            let catalog = config.into_catalog().unwrap();
            let mut contents = serde_json::to_string_pretty(&catalog).unwrap();
            contents.push('\n');
            std::fs::write("app/catalog.json", contents).unwrap();
        }
    }
}
