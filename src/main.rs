use clap::Parser;
use heystac::Args;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    Args::parse().run().await.unwrap()
}
