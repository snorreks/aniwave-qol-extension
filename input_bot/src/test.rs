use std::io::Write;
use std::process::{Command, Stdio};

fn main() {
    // Simulated JSON data as a string
    let json_data = "{\"type\": \"mouse_click\", \"payload\": {\"x\": 100, \"y\": 200 }}";

    // Execute main.rs as a child process
    let mut child = Command::new("target/debug/main")
        .stdin(Stdio::piped())
        .spawn()
        .expect("Failed to start main.rs");

    // Send JSON data to main.rs through stdin
    if let Some(mut stdin) = child.stdin.take() {
        stdin
            .write_all(json_data.as_bytes())
            .expect("Failed to write to stdin");
    }

    // Wait for the child process to finish
    let status = child.wait().expect("Failed to wait for child process");

    if status.success() {
        println!("main.rs executed successfully");
    } else {
        eprintln!("main.rs failed with exit code {:?}", status.code());
    }
}
