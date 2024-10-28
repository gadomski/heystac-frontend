use clap::Parser;
use heystac::Config;

#[derive(Debug, Parser)]
struct Args {
    #[command(subcommand)]
    subcommand: Subcommand,
}

#[derive(Debug, clap::Subcommand)]
enum Subcommand {
    /// Run the prebuild actions
    Prebuild,
}

fn main() {
    let args = Args::parse();
    match args.subcommand {
        Subcommand::Prebuild => prebuild(),
    }
}

fn prebuild() {
    let config = Config::from_path("config.toml").unwrap();
    config.write_catalog("app/catalog.json").unwrap();
}
