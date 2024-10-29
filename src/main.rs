use clap::Parser;
use heystac::Config;

#[derive(Debug, Parser)]
struct Args {
    #[command(subcommand)]
    subcommand: Subcommand,
}

#[derive(Debug, clap::Subcommand)]
enum Subcommand {
    /// Crawl all catalogs
    Crawl,

    /// Run the prebuild actions
    Prebuild,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let args = Args::parse();
    let config = Config::from_path("config.toml").unwrap();
    match args.subcommand {
        Subcommand::Crawl => {
            let catalogs = config.crawl().await.unwrap();
            std::fs::write(
                "crawl/crawl.json",
                serde_json::to_string(&catalogs).unwrap(),
            )
            .unwrap();
        }
        Subcommand::Prebuild => {
            let catalog = config.into_catalog().unwrap();
            let mut contents = serde_json::to_string_pretty(&catalog).unwrap();
            contents.push('\n');
            std::fs::write("app/catalog.json", contents).unwrap();
        }
    }
}
