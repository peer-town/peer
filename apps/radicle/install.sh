echo "Installing rust"
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

echo "Installing radicle tools"
cargo install --force --locked --git https://seed.radicle.xyz/z3gqcJUoA1n9HaHKufZs5FCSGazv5.git \
    radicle-cli radicle-node radicle-httpd radicle-remote-helper

echo "Setting up rad"
rad auth
rad self

echo "Running radicle node"
radicle-node &
radicle-httd &

echo "Done"
